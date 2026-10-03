import { useEffect } from 'react';
import { PAGE_HTML } from './pageMarkup.js';
import { bootOriginalRuntime } from './runtime.js';
import './fallback.css';

export default function App() {
  useEffect(() => {
    const id = requestAnimationFrame(() => bootOriginalRuntime());
    return () => cancelAnimationFrame(id);
  }, []);
  return <div className="gertix-clone-root" dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />;
}
