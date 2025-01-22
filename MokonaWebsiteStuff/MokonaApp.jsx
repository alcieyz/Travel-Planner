import { useState, useEffect } from 'react';
import LavuLavu from './assets/LavuLavu.png';
import HuTao from './assets/BeautifulHuTao.gif';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import MySchedule from "./pages/MySchedule";

function App() {
  
    

  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    alert('You have submitted the form.')
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="MySchedule" element ={<MySchedule/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
      <div>
      <div className="App">
      <p>{message}</p>
      </div>
      
      </div>
      {/* </BrowserRouter></div> */}
    </BrowserRouter>
  )
}
export default App;

/* function myFunction() {
  document.getElementById("demo").innerHTML = "Hello JavaScript!"
} */

/*
<script>
  function heartFound() {
    alert("You found a heart!")
  }
</script>
*/

function stuff() {
  /*
  //{<title>Best Website Ever</title>
      //<link rel="icon" type="image/x-icon" href="/assets/HXHLogo.png"></link>
      <h1>Meoooooooow</h1>
      <h3> name: Mokona</h3>

      <h2>Hi This is Mokona who you can click on to find more Mokona:</h2>
      <a title="Lots of Mokonas" href="https://www.google.com/search?sca_esv=d609cd469e173d32&rlz=1C1CHBF_enUS1124US1124&sxsrf=ADLYWIL_3VHT6BDmrfAvsRbUsZw_bRUKIQ:1736385054137&q=mokona&udm=2&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWd8nbOJfsBGGB5IQQO6L3J03RPjGV0MznOJ6Likin94pT_oR1DTSof42bOBxoTNxGn2ehXJBTLY_WkWTkcxqmW5HrdiQBb-kPCLFttCwG9GaXRQlZEIo4ofP-sykIbEq3Mczpj7rapEQVMC38UyECFzkaqPcrM-uZD3ApAkthzthSSZReC0i6l5ov2vK_baCpmdF0oA&sa=X&ved=2ahUKEwjbkuGyuueKAxWeITQIHQPSAtgQtKgLegQIEhAB&biw=1920&bih=911&dpr=1" target="_blank">
      <img src={LavuLavu} className="lavu_lavu" alt="Mokona" usemap="#mokona"/>
      </a>
      <map name="mokona">
        <area shape="circle" coords="150,125,25" alt="heart" onclick="heartFound()"></area>
      </map>

      <img src={HuTao} className="hu_tao" alt="Beautiful Hu Tao" title="BOO!"/>

      <div>
        <button onClick={() => setCount(count + count)}>
          How many Mokonas are there? {count}??? So many Mokonas!!!
        </button>
        &emsp;
        <a href="https://youtu.be/GEXue8YWwXM?si=HKVFdpJ3_Ove7i3P" target="_blank"><button>BOCCHI THE ICON</button></a>
        &emsp;
        //<button type="button" onclick="alert('BOO!')">:D</button>
        
        <p><br></br></p>

        <a href="https://hollowknight.fandom.com/wiki/Grub" target="_blank" title="this is a link that opens in a new tab :0">Bleep bloop blap</a>
        <p> <i>This is my silly website that is silly</i> </p>
        <a href="mailto:alluka.zoldyckmkz@gmail.com">Send email to me !!</a>
        <p> what if i have a very very long text i wonder if it stays on one line because it seems very narrow and i dont know how to change it, but if i make this text long enough surely it will be centered soon???</p>
        <p><small><b>I am small but bold</b></small></p>
        <p>I am normal but &nbsp;<sup>I am floating</sup></p>
        <p><ins>I am special but</ins>&nbsp;<del>I am leaving</del></p>

        <table>
          <tr>
            <th></th>
            <th>Pyro</th>
            <th>Hydro</th>
            <th>Cryo</th>
            <th>Electro</th>
            <th>Dendro</th>
            <th>Anemo</th>
            <th>Geo</th>
          </tr>
          <tr>
            <th>Pyro</th>
            <td>-</td>
            <td>Vaporize</td>
            <td>Melt</td>
            <td>Overload</td>
            <td>Burning</td>
            <td>Swirl</td>
            <td>Crystallize</td>
          </tr>
          <tr>
            <th>Hydro</th>
            <td>Vaporize</td>
            <td>-</td>
            <td>Freeze</td>
            <td>Electro-Charged</td>
            <td>Bloom</td>
            <td>Swirl</td>
            <td>Crystallize</td>
          </tr>
          <tr>
            <th>Cryo</th>
            <td>Melt</td>
            <td>Freeze</td>
            <td>-</td>
            <td>Superconduct</td>
            <td>-</td>
            <td>Swirl</td>
            <td>Crystallize</td>
          </tr>
          <tr>
            <th>Electro</th>
            <td>Overload</td>
            <td>Electro-Charged</td>
            <td>Superconduct</td>
            <td>-</td>
            <td>Catalyze</td>
            <td>Swirl</td>
            <td>Crystallize</td>
          </tr>
          <tr>
            <th>Dendro</th>
            <td>Burning</td>
            <td>Bloom</td>
            <td>-</td>
            <td>Catalyze</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th>Anemo</th>
            <td>Swirl</td>
            <td>Swirl</td>
            <td>Swirl</td>
            <td>Swirl</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th>Geo</th>
            <td>Crystallize</td>
            <td>Crystallize</td>
            <td>Crystallize</td>
            <td>Crystallize</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <caption>my lovely reactions table, although im not sure why this caption is above the table</caption>
        </table>

        <h2>I have my website in my website</h2>
        <iframe src="http://localhost:5173/" name="iframe_a" height="300px" width="100%"></iframe>
        //<p><a href="https://g.co/kgs/mka6NVG" target="iframe_a">test snake game</a></p>

        //<button type="button" onclick="myFunction()">Click Me!</button>
        //<p id="demo">This is a demonstration.</p>
        
        <form action="/" target="_self" autocomplete="on">
          <label for="name">Cat Name:</label><br></br>
          <input type="text" id="name" name="name"></input><br></br>

          <label for="color">Cat color:</label><br></br>
          <input type="text" id="color" name="color"></input><br></br>

          <p>Cat size:</p>
          <input type="radio" id="teensy" name="size" value="teensy"></input>
          <label for="teensy">teensy</label><br></br>
          <input type="radio" id="smol" name="size" value="smol"></input>
          <label for="smol">smol</label><br></br>
          <input type="radio" id="normal" name="size" value="your average neighborhood cat"></input>
          <label for="normal">your average neighborhood cat</label><br></br>
          <input type="radio" id="voluminous" name="size" value="voluminous"></input>
          <label for="voluminous">voluminous</label><br></br>
          <input type="radio" id="chonky" name="size" value="chonky"></input>
          <label for="chonky">chonky</label><br></br>

          <p>Cat likes:</p>
          <input type="checkbox" id="treats" name="treats" value="treats"></input>
          <label for="treats">treats</label><br></br>
          <input type="checkbox" id="toys" name="toys" value="toys"></input>
          <label for="toys">toys</label><br></br>
          <input type="checkbox" id="rubs" name="rubs" value="rubs"></input>
          <label for="rubs">rubs</label><br></br>
          <input type="checkbox" id="loafing" name="loafing" value="loafing"></input>
          <label for="loafing">loafing</label><br></br>
          <input type="checkbox" id="cinnamoroll" name="cinnamoroll" value="cinnamoroll"></input>
          <label for="cinnamoroll">cinnamoroll</label><br></br>
          <input type="checkbox" id="you" name="you" value="you"></input>
          <label for="you">you</label><br></br>
          <input type="checkbox" id="bugs" name="bugs" value="bugs"></input>
          <label for="bugs">bugs</label><br></br>

          <p>Cat description:</p>
          <textarea name="desc" rows="5" cols="60"></textarea><br></br>

          <label for="mamoru">Your favorite character voiced by hiroshi kamiya:</label><br></br>
          <select id="mamoru" name="character">
          <option value="select">Select</option>
            <option value="levi">Levi Ackerman</option>
            <option value="yato">Yato</option>
            <option value="rampo">Rampo Edogawa</option>
            <option value="neuvillette">Neuvillette</option>
            <option value="mephisto">Mephisto Pheles</option>
            <option value="saiki">Kusuo Saiki</option>
          </select>

          <br></br><br></br>

          <input type="submit" value="Done!!!"></input>
        </form>
  */
}
