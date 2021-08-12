import { Image } from "react-native";

export const ImageAssets = {
  BGCoverCoffee: require('../../assets/images/unsplash_coffee.jpg'),
  BGCoverDiagram: require('../../assets/images/unsplash_diagram.jpg'),
  BGCoverDiagramBlurred: require('../../assets/images/unsplash_diagram_blurred.jpg'),
  
  ProfilePicDominicStop: require('../../assets/images/domicstop_profile.jpg'),

  IconOfficeLady: require('../../assets/images/office_lady_icon.png'),
  IconVideoGame: require('../../assets/images/videogame_icon.png'),
  IconBackChevron: require('../../assets/images/chevron_back.png'),
};

export class ImageCache {
  static async loadImages() { 
    const images = Object.keys(ImageAssets);

    await Promise.all(
      images.map((key) => {
        const image = Image.resolveAssetSource(ImageAssets[key]);
        return Image.prefetch(image.uri);
    }));
  };
};