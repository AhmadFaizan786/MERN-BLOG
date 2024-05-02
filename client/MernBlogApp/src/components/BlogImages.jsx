export default function BlogImages({src,...rest}){
  src =src && src.includes('https://')?src : `${import.meta.env.VITE_API_BASE_URL}/post${src}`;;
  return (
    <img {...rest} src={src} alt={''}/>
  )
}