import { ReactElement, useState, useEffect } from 'react';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  fallback: string;
};

export function ImageWithFallback(props: Props): ReactElement {
  const { src, alt, fallback, className } = props;

  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallback);
  };

  useEffect(() => {
    if (!src) setImgSrc(fallback);
  }, []);

  return (
    <img className={className} src={imgSrc} alt={alt} onError={handleError} />
  );
}
