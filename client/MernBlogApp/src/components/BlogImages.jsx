export default function BlogImages({src,...rest}){
  src =src && src.includes('https://')?src : 'https://mern-blog-bqop.onrender.com/post'+src;
  return (
    <img {...rest} src={src} alt={''}/>
  )
}