class Search extends React.Component {    
  constructor() {
    super();
    this.state = { 
      search: undefined,
      miles: 10, 
      thickness: 'all',
      catResults: undefined,
      colors: undefined,
      colArr: [],
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
    
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
    let search_data = {'search': this.state.search,
                       'miles': this.state.miles,
                       'thickness': this.state.thickness}; 
    //loading is true show dancing fat cat
    $.post('/results.json', search_data, (response) => { 
      this.setState({catResults: response} //, () => {
        // loading = false
      );
      
      if (this.state.catResults === response) {
        let catColors = new Set();
        // this.catColors.values()
        Object.entries(this.state.catResults).forEach(([key, value]) => {
          if (value.color != null) {
              catColors.add(value.color);
          }
        });
       this.setState({colors: catColors});
      }
      const arr = [];
      for (let c of this.state.colors) {
        arr.push(c)
      }
      this.setState({colArr: arr})
    });
  }
 
  render() {

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
          <TubboContainer
            cats={this.state.catResults}
            arr={this.state.colArr}
          /> 
        </div>
      </div>
    );
  }
}


class TubboContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cats: props.cats}
    this.makeCats = this.makeCats.bind(this);
  }

  // this.state.cats // all cats

 // filterCats
     // updates the this.state.cats

 // pass filterCats.bind(this) to Filters and call it in Filters when a new filter is selected

  makeCats() {
    const cats = [];
    const colors = [];
    const both = [cats, colors]
    for (const cat of this.props.cats) {
      cats.push(<Cat 
                  key={cat.cat_id}
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
        <div>
          <div id="prop-all-cats">
            {this.makeCats()}       
          </div>
          <div id="cat-filters">
            <Filters 
              arr={this.props.arr}
            />
          </div>
        </div>
      );
    } 
    else {
      return (
        <div></div>
      );
    }
  }
}


class Filters extends React.Component {
  render() {
    return (
        <div>
          <select>
            {this.props.arr.map((x,y) => <option key={y}>{x}</option>)}
          </select>
        </div>
      )
  }
}


class Cat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shelterInfo: undefined,
      showComponent: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    let shelter = {'shelter_id': this.props.shelterId};
    $.post('/shelter.json', shelter, (response) => { 
      this.setState({shelterInfo: response, showComponent: true})
    });
  }


  render() {

    return (
      <div className="individ-cat">
         <button onClick={this.onButtonClick}>
            <img className="medium-image" src={this.props.photo}/>
            <p>{this.props.name}</p>
          </button>
        <div id="cat-more-details">
          {this.state.showComponent ?
            <MoreDetails name={this.props.name}
                         breed={this.props.breed}
                         gender={this.props.gender}
                         color={this.props.color}
                         coatLen={this.props.coatLen}
            /> :
            null
          }        
        </div> 
        <div id="shelter-response">
          {this.state.showComponent ?
            <Shelter details={this.state.shelterInfo}
            /> :
            null
          }
        </div>               
      </div>
    );
  }
}


class Shelter extends React.Component {
  constructor(props) {
    super(props);
    this.shelterInfo = this.shelterInfo.bind(this);
  }
  
  shelterInfo() {
    const tubboLocation = []
    for (const info of this.props.details) {
      tubboLocation.push(<MoreDetails 
                          key={info.shelter_id}
                          email={info.email}
                        />
      );
    }
    return tubboLocation
  }

  render() {
    if (this.props.details) {
      return (
         <div>
           {this.shelterInfo()}
         </div>
      );
    }
    else {
      return (
        <div></div>
      )
    }
  }
}


class MoreDetails extends React.Component {

  render() {
      return (
        <div>
          <p>{this.props.name}</p>
          <p>{this.props.breed}</p>
          <p>{this.props.email}</p>
        </div>
      );
    }
  }



// ReactDOM.render(
//   <MoreDetails catId={this.props.catId}/>,
//   document.getElementById('app')
// );

ReactDOM.render(
  <Search />,
  document.getElementById('app')
);