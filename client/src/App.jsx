import React, { useState, useEffect } from "react";
import twitterLogo from "./assets/twitter.svg";
import "./App.css";
import { FaCrosshairs } from "react-icons/fa";

function App() {
  const [trends, setTrends] = useState([]);
  const [woeid, setwoeid] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrendingTopics = async (woeid) => {
    setIsLoading(true);
    const response = await fetch(
      `https://trendingtweets.netlify.app/.netlify/functions/server/trends?woeid=${woeid}`,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
        });
    const data = await response.json();
//    console.log(data);
    setTrends(data[0].trends);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTrendingTopics(woeid);
  }, [woeid]);

  const locationHandler = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationResponse = await fetch(
            `https://trendingtweets.netlify.app/.netlify/functions/server/near-me?lat=${position.coords.latitude}&long=${position.coords.longitude}`
          );
          const data = await locationResponse.json();
          //console.log(data);
          setwoeid(data[0].woeid);
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={twitterLogo} className="logo" alt="Twitter Logo" />
        <h3>Trending Tweets</h3>
      </header>
      <div className="menu">
        <select
          name="trending-place"
          onChange={(e) => setwoeid(e.target.value)}
        >
          <option value="1">Worldwide</option>
          <option value="1118370">Tokyo,JP</option>
          <option value="23424868">South Korea</option>
          <option value="23424848">New Delhi,IN</option>
          <option value="2459115">New York,US</option>
          <option value="2442047">Los Angeles,US</option>
          <option value="1105779">Sydney,AU</option>
        </select>
        <div className="location" onClick={locationHandler}>
          <FaCrosshairs />
        </div>
      </div>
      <div className="content">
        <ul>
          {isLoading && [...Array(31)].map((elem, index)=>(
            <li className='skeleton skeletonLi' key={index}></li>
          ))}

          {!isLoading && trends.map((trend, index) => (
            <li key={index}>
              <a href={trend.url}>{trend.name}</a>
              {trend.tweet_volume && (
                <span className="tweet_volume">{trend.tweet_volume}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
