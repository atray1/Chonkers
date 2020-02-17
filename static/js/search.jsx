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
    this.state = { search: undefined, miles: undefined, thickness: undefined }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value})
    
    let element = document.getElementById('miles');
    if (e.target.name === 'miles' || e.target.value === 'other') {
        element.style.display = 'block';
    }
    else {
        element.style.display = 'none';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let search = this.state.search;
    let miles = this.state.miles;
    let thickness = this.state.miles;

    let search_data = {
      search: this.state.search,
      miles: this.state.miles,
      thickness: this.state.thickness
    }

    $.post('/search-results', search_data, (response) => console.log(response))

  }


  render() {
    return (
      <div>
        <form>
          <label>
            Search:
              <input name='search' type='text' onChange={this.handleInput}/>
          </label>
          <br></br>
          <label>
          Distance:
            <select name='miles' onChange={this.handleInput}>
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
            Chonk Preference:
            <select name='thickness' onChange={this.handleInput}>
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