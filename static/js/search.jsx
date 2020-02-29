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
    this.state = { 
      search: undefined,
      miles: 10, 
      thickness: 'all',
      catResults: undefined
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value})
    
    let element = document.getElementById('miles');
    if (e.target.name === 'miles' && e.target.value === 'other') {
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
      'search': this.state.search,
      'miles': this.state.miles,
      'thickness': this.state.thickness
    };
    
    $.post('/results.json', search_data, (response) => { 
      this.setState({catResults: response})
    });
  }

  render() {
    let cats = this.state.catResults
    console.log('this is my results', cats)
    return (
      <div>
        <form>
          <div>
            <label>
              Search:
                <input name='search' type='text' onChange={this.handleInput}/>
            </label>
          </div>
          <div>
          <label>
          Distance:
            <select name='miles' defaultValue={this.state.miles} onChange={this.handleInput}>
              <option value='10'>10 Miles</option>
              <option value='25'>25 Miles</option>
              <option value='50'>50 Miles</option>
              <option value='100'>100 Miles</option>
              <option value='other'>Other</option>
            </select>
          </label>
          <input name='miles' id='miles' type='text' style={{display: this.element ? 'block' : 'none'}}></input>
          </div>
          <div>
          <label>
          Chonk Preference:
            <select name='thickness' defaultValue={this.state.thickness} onChange={this.handleInput}>
              <option value='large'>Jumbo Chonk</option>
              <option value='xlarge'>Colossal Chonk</option>
              <option value='all'>All Chonkers Need Love</option>
            </select>
          </label>
          </div>
          <button onClick={this.handleSubmit}>Submit</button>
        </form>

        <div id="response-all-cats">
        {/* connecting to the tubbocontainer class - making an instance - passing
         results from api req as a prop. cats is the prop ---> this.props.cats*/}
          <TubboContainer
            cats={this.state.catResults}
          /> 
        </div>

      </div>
    );
  }
}


class TubboContainer extends React.Component {
  constructor(props) {
    super(props);
    this.makeCats = this.makeCats.bind(this);
  }

  makeCats() {
    const cats = []
    for (const cat of this.props.cats) {
      cats.push(<Cat 
                  key={cat.cat_id}
                  catId={cat.cat_id}
                  name={cat.name}
                  photo={cat.photo_url.medium}
                  gender={cat.gender}
                  breed={cat.breed}
                  coatLen={cat.coat_len}
                  color={cat.color}
                  extraLove={cat.extra_love}
                  kids={cat.environment.kids}
                  dogs={cat.environment.dogs}
                  cats={cat.environment.cats}
                  shelterId={cat.shelter_id}
                />
               );
    }
    return cats
  }

  render() {
    if (this.props.cats) {
      return (
        <div id="prop-all-cats">
          {this.makeCats()}          
        </div>
      );
    } 
    else {
      return (
        <div> Please enter a search </div>
      );
    }
  }
}


class Cat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tubboLocation: undefined,
      showComponent: false,
    };
    this._onButtonClick = this._onButtonClick.bind(this);
  }

  _onButtonClick() {

// ReactDOM.render(
//   <MoreDetails catId={this.props.catId}/>,
//   document.getElementById('app')
// );
    let shelter = {'shelter_id': this.props.shelterId}
    console.log(shelter)
    $.post('/shelter.json', shelter, (response) => { 
      this.setState({tubboLocation: response, showComponent: true})
    });
  }

  render() {
    return (
      <div className="individ-cat">

      <button onClick={this._onButtonClick}>
        <img 
          className="medium-image" 
          src={this.props.photo} 
          alt="HTML5"
          style={{width: 350, height: 350}}
         />
        <p>{this.props.name}</p>
      </button>
      
      <div>
      {this.state.showComponent ?
        <MoreDetails catId={this.props.catId}
                     shelterId={this.props.shelterId}
        /> :
        null
      }
      </div> 
      
      </div>
    );
  }
}



class MoreDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.catId}</div>
    )
  }
}




ReactDOM.render(
  <Search />,
  document.getElementById('app')
);