//
//  RNIImageItem.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/29/21.
//

import Foundation

internal struct RNIImageMaker {

  let size        : CGSize;
  let fillColor   : UIColor;
  let borderRadius: CGFloat;
  
  init?(dict: NSDictionary) {
    guard let width  = dict["width" ] as? CGFloat,
          let height = dict["height"] as? CGFloat
    else { return nil };
    
    self.size = CGSize(width: width, height: height);
    
    guard let fillColorValue = dict["fillColor" ],
          let fillColor      = UIColor.parseColor(value: fillColorValue)
    else { return nil };
    
    self.fillColor = fillColor;
    
    self.borderRadius = dict["borderRadius"] as? CGFloat ?? 0;
  };

  func makeImage() -> UIImage {
    return UIGraphicsImageRenderer(size: self.size).image { context in
      let rect = CGRect(origin: .zero, size: self.size);
      
      let clipPath = UIBezierPath(
        roundedRect : rect,
        cornerRadius: self.borderRadius
      );
      
      clipPath.addClip();
      self.fillColor.setFill();
      
      context.fill(rect);
    };
  };
};

internal struct RNIImageGradientMaker {
  enum PointPresets: String {
    case top, bottom, left, right;
    case bottomLeft, bottomRight, topLeft, topRight;
    
    var cgPoint: CGPoint {
      switch self {
        case .top   : return CGPoint(x: 0.5, y: 0.0);
        case .bottom: return CGPoint(x: 0.5, y: 1.0);
          
        case .left : return CGPoint(x: 0.0, y: 0.5);
        case .right: return CGPoint(x: 1.0, y: 0.5);
          
        case .bottomLeft : return CGPoint(x: 0.0, y: 1.0);
        case .bottomRight: return CGPoint(x: 1.0, y: 1.0);

        case .topLeft : return CGPoint(x: 0.0, y: 0.0);
        case .topRight: return CGPoint(x: 1.0, y: 0.0);
      };
    };
  };
  
  enum DirectionPresets: String {
    // horizontal
    case leftToRight, rightToLeft;
    // vertical
    case topToBottom, bottomToTop;
    // diagonal
    case topLeftToBottomRight, topRightToBottomLeft;
    case bottomLeftToTopRight, bottomRightToTopLeft;
    
    var point: (start: CGPoint, end: CGPoint) {
      switch self {
        case .leftToRight:
          return (CGPoint(x: 0.0, y: 0.5), CGPoint(x: 1.0, y: 1.5));
          
        case .rightToLeft:
          return (CGPoint(x: 1.0, y: 0.5), CGPoint(x: 0.0, y: 0.5));
          
        case .topToBottom:
          return (CGPoint(x: 0.5, y: 1.0), CGPoint(x: 0.5, y: 0.0));
          
        case .bottomToTop:
          return (CGPoint(x: 0.5, y: 1.0), CGPoint(x: 0.5, y: 0.0));
          
        case .topLeftToBottomRight:
          return (CGPoint(x: 0.0, y: 0.0), CGPoint(x: 1.0, y: 1.0));
          
        case .topRightToBottomLeft:
          return (CGPoint(x: 1.0, y: 0.0), CGPoint(x: 0.0, y: 1.0));
          
        case .bottomLeftToTopRight:
          return (CGPoint(x: 0.0, y: 1.0), CGPoint(x: 1.0, y: 0.0));
          
        case .bottomRightToTopLeft:
          return (CGPoint(x: 1.0, y: 1.0), CGPoint(x: 0.0, y: 0.0));
      };
    };
  };
  
  static private func extractCGPoint(dict: NSDictionary) -> CGPoint? {
    guard let x = dict["x"] as? CGFloat,
          let y = dict["y"] as? CGFloat
    else { return nil };
    
    return CGPoint(x: x, y: y);
  };
  
  static private func extractPoint(dict: NSDictionary, key: String) -> CGPoint? {
    if let pointDict = dict[key] as? NSDictionary,
       let point = Self.extractCGPoint(dict: pointDict) {
      
      return point;
      
    } else if let pointString = dict[key] as? String,
              let point = PointPresets(rawValue: pointString) {
      
      return point.cgPoint;
      
    } else {
      return nil;
    };
  }
  
  let type: CAGradientLayerType;
  
  let colors    : [CGColor];
  let locations : [NSNumber]?;
  let startPoint: CGPoint;
  let endPoint  : CGPoint;
  
  var size: CGSize;
  let borderRadius: CGFloat;
  
  var gradientLayer: CALayer {
    let layer = CAGradientLayer();
    
    layer.type         = self.type;
    layer.colors       = self.colors;
    layer.locations    = self.locations;
    layer.startPoint   = self.startPoint;
    layer.endPoint     = self.endPoint;
    layer.cornerRadius = self.borderRadius;
    
    return layer;
  };
  
  init?(dict: NSDictionary) {
    guard let colors = dict["colors"] as? NSArray
    else { return nil };
    
    self.colors = colors.compactMap {
      guard let string = $0 as? String,
            let color = UIColor(cssColor: string)
      else { return nil };
      
      return color.cgColor;
    };
    
    self.type = {
      guard let string = dict["type"] as? String,
            let type   = CAGradientLayerType(string: string)
      else { return .axial };
      
      return type;
    }();
    
    self.locations = {
      guard let locations = dict["locations"] as? NSArray else { return nil };
      return locations.compactMap { $0 as? NSNumber };
    }();
    
    self.startPoint = Self.extractPoint(dict: dict, key: "startPoint")
      ?? PointPresets.top.cgPoint;
    
    self.endPoint = Self.extractPoint(dict: dict, key: "endPoint")
      ?? PointPresets.bottom.cgPoint;
    
    self.size = CGSize(
      width : (dict["width" ] as? CGFloat) ?? 0,
      height: (dict["height"] as? CGFloat) ?? 0
    );
    
    self.borderRadius = dict["borderRadius"] as? CGFloat ?? 0;
  };
  
  mutating func setSizeIfNotSet(_ size: CGSize){
    self.size = CGSize(
      width : self.size.width  <= 0 ? size.width  : self.size.width,
      height: self.size.height <= 0 ? size.height : self.size.height
    );
  };
  
  func makeImage() -> UIImage {
    return UIGraphicsImageRenderer(size: self.size).image { context in
      let rect = CGRect(origin: .zero, size: self.size);
      
      let gradient = self.gradientLayer;
      gradient.frame = rect;
      gradient.render(in: context.cgContext);
      
      let clipPath = UIBezierPath(
        roundedRect : rect,
        cornerRadius: self.borderRadius
      );
      
      clipPath.addClip();
    };
  };
};

internal class RNIImageItem {
  
  static private var imageCache: [String: UIImage] = [:];
  
  enum ImageType: String {
    case IMAGE_ASSET;
    case IMAGE_SYSTEM;
    case IMAGE_REQUIRE;
    case IMAGE_EMPTY;
    case IMAGE_RECT;
    case IMAGE_GRADIENT;
  };
  
  let type: ImageType;
  
  var useImageCache: Bool?;
  
  var defaultSize = CGSize(width: 100, height: 100);
  
  private let imageValue: Any?;
  private var imageRequire: UIImage?;
  
  var shouldUseImageCache: Bool {
    // use cache if image require if `useImageCache` is not set
    self.useImageCache ?? (self.type == .IMAGE_REQUIRE)
  };
  
  var image: UIImage? {
    switch self.type {
      case .IMAGE_ASSET:
        guard let string = self.imageValue as? String,
              let image  = UIImage(named: string)
        else { return nil };
        return image;
        
      case .IMAGE_SYSTEM:
        guard #available(iOS 13.0, *),
              let string = self.imageValue as? String,
              let image  = UIImage(systemName: string)
        else { return nil };
        return image;
        
      case .IMAGE_REQUIRE:
        guard let dict = self.imageValue as? NSDictionary,
              let uri  = dict["uri"] as? String
        else { return nil };
        
        if self.shouldUseImageCache,
           let cachedImage = Self.imageCache[uri] {
          
          return cachedImage;
        };
        
        // note: this will block the current thread
        let image = RCTConvert.uiImage(self.imageValue);
        
        if self.shouldUseImageCache, let image = image {
          Self.imageCache[uri] = image;
        };
        
        return image;
      
      case .IMAGE_EMPTY:
        return UIImage();
        
      case .IMAGE_RECT:
        guard let dict        = self.imageValue as? NSDictionary,
              let imageConfig = RNIImageMaker(dict: dict)
        else { return nil };
        
        return imageConfig.makeImage();
        
      case .IMAGE_GRADIENT:
        guard let dict        = self.imageValue as? NSDictionary,
              var imageConfig = RNIImageGradientMaker(dict: dict)
        else { return nil };
        
        imageConfig.setSizeIfNotSet(self.defaultSize);
        return imageConfig.makeImage();
    };
  };
  
  init?(type: ImageType, imageValue: Any?){
    self.type = type;
    self.imageValue = imageValue;
  };
  
  convenience init?(dict: NSDictionary){
    guard let typeString = dict["type"] as? String,
          let type       = ImageType(rawValue: typeString)
    else { return nil };
    
    self.init(type: type, imageValue: dict["imageValue"]);
  };
};
