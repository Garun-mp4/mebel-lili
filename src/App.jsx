import { useEffect } from 'react';
import { PAGE_HTML } from './pageMarkup.js';
import { bootOriginalRuntime } from './runtime.js';
import './fallback.css';

export default function App() {
  useEffect(() => {
    let cleanup;
    const id = requestAnimationFrame(() => { cleanup = bootOriginalRuntime(); });
    return () => { cancelAnimationFrame(id); cleanup?.(); };
  }, []);
  return <div className="mebel-lili-root" dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />;
}
