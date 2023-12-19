import { useCallback, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
function App() {
  const [pgNo, setPgno] = useState(1)
  const [arr, setArr] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const lastItemRef = useRef(null);

  const fetch = (pgNo) => {
    axios
      .get(`https://api.github.com/search/users?q=s&per_page=10&page=${pgNo}`)
      .then(res => {
        setArr([...arr, ...res.data.items])
        setIsLoading(false)
      })
      .catch(err => {
        console.log("failed: ", err);
      })
  }

  useEffect(() => {
    fetch(pgNo)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setPgno(prev => prev + 1)
          setIsLoading(true)
          fetch(pgNo + 1)
        }
      });
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [arr]);

  return (
    <>
      <div className="wrapper">
        <ul>
          {arr.map((item, ind) => {
            return (
              <div className='card' ref={ind + 1 === arr.length ? lastItemRef : null}>{ind + 1}{'. '}{item.login}</div>
            )
          })}
        </ul>
        {isLoading && <div className='card loading'>Loading...</div>}
      </div>
    </>
  )
}

export default App
