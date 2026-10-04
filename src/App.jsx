import { useEffect } from 'react';
import { PAGE_HTML } from './pageMarkup.js';
import { SERVICES } from '../seo/site.mjs';
import { servicePage } from './servicePages.mjs';
import { bootOriginalRuntime } from './runtime.js';
import './fallback.css';

export default function App() {
  const currentPage = SERVICES.find(page => page.path === window.location.pathname);
  useEffect(() => {
    let cleanup;
    const id = requestAnimationFrame(() => { cleanup = bootOriginalRuntime(); });
    return () => { cancelAnimationFrame(id); cleanup?.(); };
  }, []);
  return <div className="mebel-lili-root" dangerouslySetInnerHTML={{ __html: currentPage ? servicePage(currentPage) : PAGE_HTML }} />;
}
