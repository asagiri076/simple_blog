interface DateDisplayProps {
  date: string
  format?: 'short' | 'long'
  className?: string
}

export default function DateDisplay({ 
  date, 
  format = 'short', 
  className = '' 
}: DateDisplayProps) {
  const formatDate = (dateString: string, formatType: 'short' | 'long') => {
    const dateObj = new Date(dateString)
    
    if (formatType === 'long') {
      return dateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return dateObj.toLocaleDateString('ja-JP')
  }

  return (
    <time className={className} dateTime={date}>
      {formatDate(date, format)}
    </time>
  )
}