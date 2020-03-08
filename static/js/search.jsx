//show results based on distance 

class Search extends React.Component {    
  constructor() {
    super();
    this.state = { 
      search: undefined,
      miles: 100, 
      thickness: 'large,xlarge',
      catResults: undefined,
      colArr: [],
      catBreeds: [],
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $.get('/breeds.json', (response) => {this.setState({catBreeds: response.breeds})});
    $.get('/colors.json', (response) => {this.setState({colArr: response.colors})});
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
    
    if (this.state.catResults !== undefined) {
      let element = document.getElementById('miles');
      if (e.target.name === 'miles' && e.target.value === 'other') {
          element.style.display = 'block'
      }
      else {
          element.style.display = 'none'
      }
     this.handleSubmit(e)
    }
  }

  handleSubmit(e) {
    if (this.state.catResults === undefined) {
      e.preventDefault();
    }
      let search = this.state.search;
      let miles = this.state.miles;
      let thickness = this.state.thickness;
      let search_data = {search: this.state.search,
                         miles: this.state.miles,
                         thickness: this.state.thickness}; 
    //loading is true show dancing fat cat
      $.post('/results.json', search_data, (response) => { 
        this.setState({catResults: response}); //, () => {
          // loading = false
      });
  }  

  newReq(e) {
    const{name, value} = e.target;
    let search = this.state.search;
    let miles = this.state.miles;
    let thickness = this.state.thickness;
    let search_data = {search: this.state.search,
                       miles: this.state.miles,
                       thickness: this.state.thickness,
                       [e.target.name]: e.target.value};
    $.post('/results.json', search_data, (response) => { 
      this.setState({catResults: response})
    });
  }


  render() {
    console.log(this.state.thickness)

    if (this.state.catResults === undefined) {
      return (
        <div>
          <form>
            <div id='search'>
              <label>
                Search:
                <input name='search' type='text' onChange={this.handleInput}></input>
              </label>
                <button onClick={this.handleSubmit}>I'm Feeling Chonky</button>
            </div>        
          </form>
        </div>
      );
    }

    else {
      return (
        <div>
          <label>
          Chonk Preference:
            <select name='thickness' id='thickness' defaultValue={this.state.thickness} 
                    onChange={this.handleInput}>
              <option value='large'>Jumbo Chonk</option>
              <option value='xlarge'>Colossal Chonk</option>
              <option value='large,xlarge'>All Chonkers Need Love</option>
            </select>
          </label>
          <label>
            Search:
              <input name='search' id='search' defaultValue={this.state.search} 
                     type='text' onChange={this.handleInput}></input>
          </label>
          <label>
            Distance:
              <select name='miles' id='milesQ' defaultValue={this.state.miles} 
                      onChange={this.handleInput}>
                <option value='10'>10 Miles</option>
                <option value='25'>25 Miles</option>
                <option value='50'>50 Miles</option>
                <option value='100'>100 Miles</option>
                <option value='other'>Other</option>
              </select>
              <input name='miles' id='miles' type='text' 
                     style={{display: this.element ? 'block' : 'none'}}></input>
          </label>          
          <div id="response-all-cats">
            <TubboContainer
              cats={this.state.catResults}
              arr={this.state.colArr}
              breedArr={this.state.catBreeds}
              newCats={this.newReq.bind(this)}
            /> 
          </div>          
        </div>        
      );
    }
  }
}


class TubboContainer extends React.Component {
  constructor(props) {
    super(props);
    this.makeCats = this.makeCats.bind(this);
  }

  makeCats() {
    const cats = [];
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
          <div id='prop-all-cats'>
            {this.makeCats()}       
          </div>
        <div className='filterResults'>
          <div id='colorFilter'>
            <label>
              Color
                <select name='color' onChange={this.props.newCats}>
                  {this.props.arr.map((x,y) => <option key={y}>{x}</option>)}
                </select>
            </label>
          </div>
          <div id='breedFilter'>
            <label>
              Breed
                <select name='breed' onChange={this.props.newCats}>
                   {this.props.breedArr.map((x,y) => <option key={y}>{x}</option>)}        
                </select>
            </label>
          </div>
          <div id='coatFilter'>
            <label>
              Coat Length
                <select name='coat' onChange={this.props.newCats}>
                  <option value='Long'>Long</option>
                  <option value='Medium'>Medium</option>
                  <option value='Short'>Short</option>
                  <option value='Hairless'>Hairless</option>
                </select>
            </label>
          </div>
          <div id='genderFiler'>
            <label>
              Gender
                <select name='gender' onChange={this.props.newCats}>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select> 
            </label>        
           </div>
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


class Cat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {shelterInfo: undefined};
    this.onButtonClick = this.onButtonClick.bind(this);
    this.shelterInfo = this.shelterInfo.bind(this);
  }

  shelterInfo(response) {
    const tubboLocation = []
    let res = response[0]
    tubboLocation.push(<MoreDetails 
                        key={res.shelter_id}
                        shelterName={res.name}
                        phone={res.phone}
                        url={res.url}
                        email={res.email}
                        address={res.location.address}
                        city={res.location.city}
                        state={res.location.state}
                        zipcode={res.location.zipcode}
                      />
        );
    this.setState({shelterInfo: tubboLocation});
  }

  onButtonClick() {
    let shelter = {'shelter_id': this.props.shelterId};
    $.post('/shelter.json', shelter, (response) => {
      this.shelterInfo(response)
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
          {this.state.shelterInfo ?
            <MoreDetails name={this.props.name}
                         breed={this.props.breed}
                         gender={this.props.gender}
                         color={this.props.color}
                         coatLen={this.props.coatLen}
                         photo={this.props.photo}
                         shelter={this.state.shelterInfo}
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
    super(props)
    this.googleMapRef = React.createRef()
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script")
    googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=&libraries=places'
    window.document.body.appendChild(googleMapScript)
    googleMapScript.addEventListener('load', () => {
      this.moodyMap = this.createGoogleMap() 
     });
  }

  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 3,
      center: {
        lat: 26.8206,
        lng: 30.8025,
      },
      disableDefaultUI: true,
    })
  }

  render() {
    let shelProp = this.props.shelter[0]['props']

    return (
      <div>
        <div id='catSummary'>
          <h4>{this.props.name}</h4>
          <p>{this.props.breed}</p>
        </div>
        
        <div id='about'>
          <h4>About</h4>
          <p>
            Coat Length
              <br></br>
              {this.props.coatLen}
              <br></br>
            House-Trained
              <br></br>
            Health
              <br></br>
            Adoption Fee
              <br></br>
          </p>
        </div>

        <div id='shelterSummary'>
          <h4>{shelProp['shelterName']}</h4>
          <div id='map' ref={this.googleMapRef} style={{width: 400, height: 300}}></div>
          <p>
            Address: 
              <br></br>
              {shelProp['address']}
              <br></br>
              {shelProp['city']},&nbsp;
              {shelProp['state']}&nbsp;
              {shelProp['zipcode']}
              <br></br>
              {shelProp['email']}
              <br></br>
              {shelProp['phone']}
          </p>
        </div>
      
      </div>
    );
  }
}




ReactDOM.render(
  <Search />,
  document.getElementById('app')
);