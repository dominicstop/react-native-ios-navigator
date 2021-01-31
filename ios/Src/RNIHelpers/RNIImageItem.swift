//
//  RNIImageItem.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/29/21.
//

import Foundation

class RNIImageItem {
  
  static var imageCache: [String: UIImage] = [:];
  
  enum ImageType: String {
    case IMAGE_ASSET;
    case IMAGE_SYSTEM;
    case IMAGE_REQUIRE;
    case IMAGE_EMPTY;
  };
  
  let type: ImageType;
  
  var useImageCache = false;
  var isImageRequireLoaded = false;
  var onImageRequireDidLoad: ((_ image: UIImage) -> ())?;
  
  private let imageValue: Any;
  private var imageRequire: UIImage?;
  
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
        return self.imageRequire;
      
      case .IMAGE_EMPTY:
        return UIImage();
    };
  };
  
  init?(type: ImageType, imageValue: Any){
    self.type = type;
    self.imageValue = imageValue;
    
    // load "IMAGE_REQUIRE" image...
    if type == .IMAGE_REQUIRE {
      self.loadImageRequire();
    };
  };
  
  private func loadImageRequire(){
    guard let dict = self.imageValue as? NSDictionary,
          let uri  = dict["uri"] as? String
    else { return };
    
    if self.useImageCache,
       let cachedImage = Self.imageCache[uri] {
      
      self.isImageRequireLoaded = true;
      self.onImageRequireDidLoad?(cachedImage);
      self.imageRequire = cachedImage.withRenderingMode(.alwaysOriginal);
      
    } else {
      RNIUtilities.loadImage(dict: dict){ error, image in
        self.isImageRequireLoaded = true;
        guard let image = image else { return };
        
        self.imageRequire = image.withRenderingMode(.alwaysOriginal);
        self.onImageRequireDidLoad?(image);
        
        if self.useImageCache {
          // store loaded image in cache
          Self.imageCache[uri] = image;
        };
      };
    };
  };
};

extension RNIImageItem {
  
  static func waitForAllImagesToLoad(
    images    : [RNIImageItem],
    completion: @escaping ([UIImage?]) -> ()
  ){
    
    var loadedImages: [UIImage?] = [];
    
    for item in images {
      let isImageRequire = item.type == .IMAGE_REQUIRE;
      
      if item.isImageRequireLoaded || !isImageRequire {
        // item is not "IMAGE_REQUIRE", or the image has already loaded
        loadedImages.insert(item.image, at: 0);
      
      } else {
        item.onImageRequireDidLoad = { _ in
          // "require image" has loaded...
          loadedImages.insert(item.image, at: 0);
            
          // all the image items have been loaded...
          if loadedImages.count == images.count {
            completion(loadedImages);
          };
        };
      };
    };
  };
};
