// class Test extends React.Component {
    
//     constructor() {
//         super();

//     }
//     render() {
//         const hello = 'hi'
//         return (
//             <div>{hello}</div>
//             )
//     }
// }


class Search extends React.Component {
    
  constructor() {
    super();
    this.state = { search: undefined, miles: 10, thickness: 'Jumbo Chonk' }
    this.customMiles = this.customMiles.bind(this)
  }

  customMiles(e) {
    this.setState({[e.target.miles]: e.target.value})
    let element = document.getElementById('miles');
    if (e.target.value === 'other')
        element.style.display = 'block';
    else
        element.style.display = 'none';
  }

  render() {
    return (
      <div>
        <form>
          <label>
            Search:
              <input name='search' type='text'/>
          </label>
          <br></br>
          <label>
          Distance:
            <select name='miles' onChange={this.customMiles}>
              <option value='10'>10 Miles</option>
              <option value='25'>25 Miles</option>
              <option value='50'>50 Miles</option>
              <option value='100'>100 Miles</option>
              <option value='other'>Other</option>
            </select>
          </label>
          <input name='miles' id='miles' type='text' style={{display: this.element ? 'block' : 'none'}}></input>
          <br></br>
          <label>
            Chonk Preference
            <select name='thickness'>
              <option value='large'>Jumbo Chonk</option>
              <option value='xlarge'>Colossal Chonk</option>
              <option value='all'>All Chonkers Need Love</option>
            </select>
          </label>
          <br></br>
          <input type='submit'></input>
        </form>
      </div>
    );
  }

}


ReactDOM.render(<Search />, document.getElementById('app'));