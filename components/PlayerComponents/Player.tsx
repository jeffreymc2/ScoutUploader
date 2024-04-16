// player.js
import ReactPlayer from 'react-player';
 
export function ReactPlayerAsVideo(props: { [x: string]: any; asset: any; as: any; src: any; poster: any; blurDataURL: any; }) {
  let { asset, src, poster, blurDataURL, ...rest } = props;
  let config = { file: { attributes: { poster } } };
 
  return <ReactPlayer url={src} config={config} {...rest} />;
}