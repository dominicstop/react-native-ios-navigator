
import * as Helpers from "../functions/Helpers";


export const LORUM_IPSUM_WORDS = 
  ["nullam","id","dolor","nibh","ultricies","vehicula","ut","elit","donec","sed","odio","dui","praesent","commodo","cursus","magna","vel","scelerisque","nisl","consectetur","et","aenean","eu","leo","quam","pellentesque","ornare","sem","lacinia","venenatis","vestibulum","non","mi","porta","gravida","at","eget","metus","integer","posuere","erat","a","ante","dapibus","velit","aliquet","bibendum","nulla","etiam","malesuada","mollis","euismod","quis","risus","urna","cum","sociis","natoque","penatibus","magnis","dis","parturient","montes","nascetur","ridiculus","mus","maecenas","faucibus","interdum","lorem","ipsum","sit","amet","adipiscing","fusce","tellus","ac","tortor","mauris","condimentum","fermentum","massa","justo","curabitur","blandit","tempus","porttitor","morbi","eros","cras","mattis","purus","vivamus","sagittis","lacus","augue","laoreet","rutrum","auctor","diam","varius","est","lobortis","vitae","libero","pharetra","facilisis","in","egestas","ligula","felis","semper","ullamcorper","fringilla","duis","luctus","nisi","nec"];


export function randomTitle(args: {
  minLength: number;
  maxLength: number;
}){

  const length = Helpers.getRandomInt(args.minLength, args.maxLength);

  let text = '';

  for (let i = 0; i < length; i++) {
    const isLast =  (i === length - 1);

    const randomWord = Helpers.capitalizeFirstLetter(
      Helpers.randomElement(LORUM_IPSUM_WORDS)
    );

    const nextWord = isLast? randomWord : `${randomWord} `;
    text = text + nextWord;
  };

  return text;
};

export function randomSentence(args: {
  minLength: number;
  maxLength: number;
}){

  const length = Helpers.getRandomInt(args.minLength, args.maxLength);

  let text = '';

  for (let i = 0; i < length; i++) {
    const isLast = 
      (i === 0) || (i === length - 1);

    const randomWord = Helpers.randomElement(LORUM_IPSUM_WORDS)
    const nextWord = isLast? randomWord : `${randomWord} `;

    text = text + nextWord;
  };

  return Helpers.capitalizeFirstLetter(text);
};