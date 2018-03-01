var PointsList = (props) => props.points.map(
  item => 
    <li key={item.id}>
    {item.point_name} # {item.id}
    <input type='button' value='x'onClick =
      {
        /*construct_rmPoint_Handler(props.rmPoint, item.id)*/
        function () {props.rmPoint(item.id)}
      }/>
    </li>
);
const Marker = (props) => 
<div key={props.id} lat={props.lat} lng={props.lng}><img src={"https://maps.google.com/mapfiles/marker"+String.fromCharCode(props.id + 65)+".png"} /></div>


var getMarkers = (points) =>points.map(item => 
<Marker id={item.id} key={item.id} lat={item.coords.lat} lng={item.coords.lng}/>)

var getCircles = (points) =>points.map(item => 
   <div key={item.id} className="place" 
  lat={item.coords.lat} 
  lng={item.coords.lng}>
  {item.id}
  </div>
)

class MyMap extends React.Component {
    static googleMap;
    static Polyline;
    static defaultProps = {
    center: {lat: 55.798917, lng: 49.098306}
  };
  constructor(props){
  super(props);
  this.handleGoogleMapApi = this.handleGoogleMapApi.bind(this);
  this.state = {
    draggable: true
  };
	}
onCircleInteraction(childKey, childProps, mouse) {
  this.setState({
    draggable: false
  });
  this.props.onChildMoveApp({id:childKey,coords:{lat:mouse.lat, lng: mouse.lng}});
}
onCircleInteraction3(childKey, childProps, mouse) {
  this.setState({draggable: true});
}
handleGoogleMapApi = (map, maps,path) =>{
            
            this.googleMap = map;
            if (this.Polyline) {this.Polyline.setMap();}
            var flightPath = new google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            this.Polyline = flightPath;
            this.Polyline.setMap(map);
          }
  
  render() {
  if(this.googleMap) {
    //debugger; 
    let multiline_points =_.map(this.props.points,function(item){return item.coords});
    this.handleGoogleMapApi(this.googleMap,null,multiline_points);
  }
  
  
    return (
      <GoogleMapReact points = {this.props.points} className="GOOGLEMAP" 
        draggable={this.state.draggable}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        onChange={this.props.getMapCenter} 
        onChildMouseUp={this.onCircleInteraction3.bind(this)}
        onChildMouseDown={this.onCircleInteraction.bind(this)}
        onChildMouseMove={this.onCircleInteraction.bind(this)}
        onChildMoveApp={this.props.onChildMoveApp} 
        yesIWantToUseGoogleMapApiInternals onGoogleApiLoaded= {({ map, maps }) => this.handleGoogleMapApi(map,maps)} 
      >
        {/*getMarkers(this.props.points)*/}
        {getCircles(this.props.points)}
  </GoogleMapReact>
   );
  }  
}
class App extends React.Component {
  constructor(props){
  super(props);
  this.state = {
    point_name:'Точка маршрута',
    points: [
	  {id:1,point_name:'Точка маршрута',coords:{lat: 55.798917, lng: 49.098306}},
	  {id:2,point_name:'Точка маршрута',coords:{lat: 55.796961141764555, lng: 49.100584536767656}},
	  {id:3,point_name:'Точка маршрута',coords:{lat: 55.794066168064774, lng: 49.0934605896241}}
	  ]
    ,center: {lat: 55.798917, lng: 49.098306}
    ,zoom: 14
	};
  this.handleChange_point_name = this.handleChange_point_name.bind(this);
  this.handleEnter_point_name = this.handleEnter_point_name.bind(this);
  //this.addPoint = this.addPoint.bind(this);
	}

  _ = () => {require ('lodash');}
  rmPoint = (id) => {    
    this.setState({
      points: _.remove((new Array().concat(this.state.points)), function(item) { return item.id != id; })
    })
  }

  handleChange_point_name = (event) => {
    this.setState({point_name: event.target.value});
  }
  handleEnter_point_name = (event) => {
    if (event.keyCode === 13) {this.addPoint()}
  }
    

  addPoint = () => {
    debugger;
     newpoint = {
    id: (this.state.points.length>0)?(_.maxBy(this.state.points, 'id').id+1):1,
    point_name:this.state.point_name,
    coords:{lat:this.state.center.lat, lng:this.state.center.lng}};
    this.setState({
      points: new Array().concat(this.state.points).concat([newpoint])
    })
  }	
  getMapCenter = (args) => {
    this.setState({center: args.center})
  }
  onChildMoveApp = (args) => {
    
    let newArray = _.map(this.state.points, 
                         function(item)
                         {
                          if (item.id==args.id)
                         {return {id:item.id,coords:{lat: args.coords.lat, lng: args.coords.lng}}} 
                          else {return item} 
                         });
    //debugger;
    this.setState({points:newArray});
    //console.log('onCircleInteraction called with', args);
  }
  
  render() {
		return (
			<div id="root">
			<table><tbody>
			<tr>
			  <td valign="top">
				<input name = "point_name" type="text" value={this.state.point_name} onChange={this.handleChange_point_name} onKeyDown={this.handleEnter_point_name}/>
				<input type="button" value="+" onClick = {this.addPoint}/><br></br>
				<ul id="points"><PointsList points={this.state.points} rmPoint={this.rmPoint}/></ul>
				  <br></br>
			</td>
			<td valign="top">
        <div style={{width: '400px', height: '400px'}}>
          <MyMap zoom={this.state.zoom} getMapCenter={this.getMapCenter} points={this.state.points} onChildMoveApp={this.onChildMoveApp} />
        </div>
			</td>
			</tr>
			</tbody></table> 
			</div>
		);
	}/**/
}

// ========================================

ReactDOM.render(<App/>,document.getElementById('root'));
