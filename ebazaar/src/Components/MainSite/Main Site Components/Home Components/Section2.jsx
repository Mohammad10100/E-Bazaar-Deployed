import './Section2.scss'
import vegetablePng from '../../../../Images/R.png'
export default function Section2() {
  return (
    <div className='main-searchBar'>
      <div className='msb-div1'>
        <img src={vegetablePng} alt="image file" />
      </div>
      <div className='msb-div2'>
      <div>
      <p>Find the Best and Fresh Groceries</p>
      </div>
      <input type="text" placeholder='Search Products' style={{width:"80%",padding:'10px 20px',marginTop:'20px',border:'solid 2px lightgray'}} />
      </div>
    </div>
  )
}