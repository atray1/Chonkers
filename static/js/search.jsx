//show results based on distance 
function showMap(position) {

}

class Search extends React.Component {    
  constructor() {
    super();
    this.state = {search: undefined,
                  miles: 100, 
                  thickness: 'large,xlarge',
                  color: undefined,
                  breed: undefined,
                  coat: undefined,
                  gender: undefined,
                  catResults: undefined,
                  colArr: [],
                  catBreeds: []};
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $.get('/breeds.json', (response) => {this.setState({catBreeds: response.breeds})});
    $.get('/colors.json', (response) => {this.setState({colArr: response.colors})});
  }

  handleInput(e) {
    if (this.state.catResults) {
      let element = document.getElementById('miles');
      if (e.target.name === 'miles' && e.target.value === 'other') {
        element.style.display = 'block';
      } 
      else {
        element.style.display = 'none';
      } 
     this.setState({[e.target.name]: e.target.value}, (e) => {
       this.handleSubmit(e)
     });
    }
    else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  inputNew(e) {
    this.setState({[e.target.name]: e.target.value}, (e) => {
      this.handleSubmit(e)});
    }

  handleSubmit(e) {
    if (this.state.catResults === undefined) {
      e.preventDefault();
    }
    let search = this.state.search;
    let miles = this.state.miles;
    let thickness = this.state.thickness;
    let color = this.state.color;
    let breed = this.state.breed;
    let coat = this.state.coat;
    let gender = this.state.gender;
    let search_data = {search: search,
                       miles: miles,
                       thickness: thickness,
                       color: color,
                       breed: breed,
                       coat: coat,
                       gender: gender}; 
  //loading is true show dancing fat cat
    $.post('/results.json', search_data, (response) => { 
      this.setState({catResults: response}); //, () => {
        // loading = false
    });
  }  

        //<img className='col-md-12' src='static/img/tubbos.png'/></div>
       // <div>
       //  <nav class="navbar navbar-expand-lg navbar-light">
       //    <a class="navbar-brand" href="#">chonkrs</a>
       //  <div class="collapse navbar-collapse" id="navbarSupportedContent">
       //    <ul class="navbar-nav mr-auto">
       //      <li class="nav-item">
       //        <li><a href="#">About</a></li> 
       //      <ul class="nav navbar-nav navbar-right">         
       //        <li><a href="#">Help</a></li>
       //      </ul>
       //  </div>
       //  </nav>


  render() {

    if (this.state.catResults === undefined) {
      navigator.geolocation.getCurrentPosition(showMap);
      return (

        <div className='container' id='main'>
        <div id='mainTubs'>
          <div className='col-xs-6 col-xs-offset-3 col-lg-12'>
              <div className='row' id="main">
                <div id='logo' className='col-centered text-center'>
                  <h1 className='logo'>chonkrs</h1>
                <form>
                  <div id='search' className='intial-search'>
                    <input className='form-control' name='search' type='text' 
                      placeholder='Search' required onChange={this.handleInput}>
                    </input>
                    <button id='chonk-btn' className='btn btn-success' type='submit' 
                      onClick={this.handleSubmit}>I'm Feeling Chonky
                    </button>
                  </div>        
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }


    else {
      return (
        <div>

          <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <button className="navbar-toggler" type="button" data-toggle="collapse" 
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
      
            <form className="form-inline my-2 my-lg-0">
              <div className="md-form my-0">
              <select className="form-control mr-sm-2" name='thickness' id='thickness' 
              defaultValue={this.state.thickness} onChange={this.handleInput}>
                <option value='large,xlarge'>All Chonkers Need Love</option>
                <option value='large'>Jumbo Chonk</option>
                <option value='xlarge'>Colossal Chonk</option>             
              </select>
              </div>
              <div className="md-form my-0">
              <select className="form-control mr-sm-2"  name='miles' id='milesQ' 
                defaultValue={this.state.miles} onChange={this.handleInput}>
                <option value='10'>10 Miles</option>
                <option value='25'>25 Miles</option>
                <option value='50'>50 Miles</option>
                <option value='100'>100 Miles</option>
                <option value='other'>Other</option>
              </select>
              <input name='miles' id='miles' type='text' 
                     style={{display: this.element ? 'block' : 'none'}}></input>            
              </div>
             <div className="md-form my-0">
              <input className="form-control mr-sm-2" name='search' id='search' 
                defaultValue={this.state.search} type='text' 
                onChange={this.handleInput}></input>

             </div>
              </form>
            </ul>
           </div>
         </nav>

          <div id="response-all-cats">
            <TubboContainer
              cats={this.state.catResults}
              arr={this.state.colArr}
              breedArr={this.state.catBreeds}
              newFilter={this.inputNew.bind(this)}
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

           //      <div className='row'></div>
           //    <div className='container'></div>
           // <div className='col-3'></div>


  render() {

    if (this.props.cats) {
      return (
        <div className='container' id='allfilters'>
          <div className='row'>
          <div className='col-xs-12 col-md-9 order-md-12' id='div-cats'>
            <div id='prop-all-cats'>
              {this.makeCats()}       
            </div>
          </div>
          <div className='col-xs-12 col-md-3 order-md-1' id='div-fil'>
           <form  id='filterResults'>
            <div>
              <div id='colorFilter'>
                <select className="form-control" name='color' 
                  onChange={this.props.newFilter}>
                  <option selected>Color</option>
                  {this.props.arr.map((x,y) => <option key={y}>{x}</option>)}
                </select>
              </div>
              <div id='breedFilter'>
                <select className="form-control" 
                   name='breed' onChange={this.props.newFilter}>
                   <option selected>Breed</option>
                   {this.props.breedArr.map((x,y) => <option key={y}>{x}</option>)}        
                </select>
              </div>
              <div id='coatFilter'>
                <select className="form-control" name='coat' 
                  onChange={this.props.newFilter}>
                  <option selected>Coat Length</option>
                  <option value='Long'>Long</option>
                  <option value='Medium'>Medium</option>
                  <option value='Short'>Short</option>
                  <option value='Hairless'>Hairless</option>
                </select>
              </div>
                <div id='genderFiler'>
                  <select className="form-control" name='gender' 
                  onChange={this.props.newFilter}>
                    <option selected>Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>        
                 </div>
              </div>
            </form>
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
    this.state = {shelterInfo: undefined,}
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
    this.setState({shelterInfo: tubboLocation}, () => {$('#moreDetailsModal').modal('show')});
  }

  onButtonClick() {
    let shelter = {'shelter_id': this.props.shelterId};
    $.post('/shelter.json', shelter, (response) => {
      this.shelterInfo(response)
    });
  }

  render() {

    return (
      <div id="individ-cat">
        <a href="#moreDetailsModal">
       <button onClick={this.onButtonClick} id="cat-btn">
          <img className="img-top" src={this.props.photo}/>
          <p className='img-name'>{this.props.name}</p>
        </button></a>
        <div id="cat-more-details">
          {this.state.shelterInfo ?
            <MoreDetails name={this.props.name}
                         breed={this.props.breed}
                         gender={this.props.gender}
                         color={this.props.color}
                         coatLen={this.props.coatLen}
                         photo={this.props.photo}
                         shelter={this.state.shelterInfo[0]['props']}
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
      this.shelter = this.geo() 
     });
  }


  geo = () => {
    let shel = this.props.shelter;
    let address = shel['address'] + ',' + shel['city'] + ',' + shel['state'] + ',' + 'United States';
    let geocoder = new google.maps.Geocoder();
    let map;
    let mapOptions;
    geocoder.geocode({'address': address}, (results) => {
      mapOptions = {zoom: 14,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()}
      map = new window.google.maps.Map(this.googleMapRef.current, mapOptions);
      map.setCenter(results[0].geometry.location);
      let marker = new window.google.maps.Marker({map: map, 
                                                  position: results[0].geometry.location,
                                                  icon: { 
                                                    url:'static/img/cat19-512.png',
                                                    scaledSize: {width: 50,
                                                                 height: 50}
                                                  }});
      return marker
    });
  }



  render() {

    return (
      <div id='fatty-modal'>
        <div className="modal right fade" id="moreDetailsModal" tabIndex="-1" 
              role="dialog" aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="moreDetailsModalLabel">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div id='catSummary'>
                  <img className="img-top" src={this.props.photo}/>
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
                  <h4>{this.props.shelter['shelterName']}</h4>
                  <div id='map' ref={this.googleMapRef} style={{width: 350, height: 250}}></div>
                  <p>
                    Address: 
                      <br></br>
                      {this.props.shelter['address']}
                      <br></br>
                      {this.props.shelter['city']},&nbsp;
                      {this.props.shelter['state']}&nbsp;
                      {this.props.shelter['zipcode']}
                      <br></br>
                      {this.props.shelter['email']}
                      <br></br>
                      {this.props.shelter['phone']}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

      


ReactDOM.render(
  <Search />,
  document.getElementById('app')
);