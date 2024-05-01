export default function BlogImages({src,...rest}){
  src =src && src.includes('https://')?src : 'http://localhost3000/post'+src;
  return (
    <img {...rest} src={src} alt={''}/>
  )
}