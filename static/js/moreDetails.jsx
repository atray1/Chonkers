class MoreDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log("blah")
  }

  render() {
    return (
      <div>{this.props.catId}</div>
    )
  }
}

ReactDOM.render(
  <MoreDetails />, 
  document.getElementById('ap')
);