<template>
	<div class="error-con">
		<div class="plane-top">
			<header :class="{ 'scrolled-nav': scrollPosition }">
				<nav>

					<!-- <ul v-show = "!mobile" class="navigation">
				<li></li>
			</ul> -->


					<div class="navigation">

						<div class="line-tabs"
							@click="showSchedules = true; showCarosuel = false; showGateMaintainence = false; showMaintainence = false;showBaggage=false; showAssignedGates = false; showAirlineSchedule = false">
							<a href="#">Schedules</a>
						</div>
						<div v-if="userType == 1" class="line-tabs"
							@click="showGateMaintainence = true; showCarosuel = false; showSchedules = false; showMaintainence = false;showBaggage=false; showAssignedGates = false; showAirlineSchedule = false">
							<a href="#">Gate Maintainence</a>
						</div>
						<div class="line-tabs"
							@click="showBaggage=true ;showCarosuel = false; showSchedules = false; showGateMaintainence = false; showMaintainence = false; showAssignedGates = false; showAirlineSchedule = false">
							<a href="#">Baggage</a>
						</div>
						<div class="line-tabs"
							@click="showAssignedGates = true; showBaggage=false ;showCarosuel = false; showSchedules = false; showGateMaintainence = false; showMaintainence = false; showAirlineSchedule = false">
							<a href="#">Assigned Gates</a>
						</div>
						<div v-if="userType == 1" class="line-tabs"
							@click="showCarosuel = true; showSchedules = false; showGateMaintainence = false; showMaintainence = false; showBaggage=false; showAssignedGates = false; showAirlineSchedule = false">
							<a href="#">Carousels</a>
						</div>
						<div v-if="userType == 2" class="line-tabs"
							@click="showMaintainence = true; showCarosuel = false; showSchedules = false; showGateMaintainence = false;showBaggage=false; showAssignedGates = false; showAirlineSchedule = false">
							<a href="#">Update Schedule</a>
						</div>
						<div v-if="(userType == 2)" class="line-tabs"
							@click="showAirlineSchedule = true; showCarosuel = false; showSchedules = false; showGateMaintainence = false; showMaintainence = false; showBaggage=false; showAssignedGates = false">
							<a href="#">{{ airline }} Airline Schedule</a>
						</div>
					</div>
					<!-- <div class="branding">
					<img src="@/assets/marcus-zymmer-72SIp7T8AHE-unsplash.jpg" alt-="" />
				</div> -->

				</nav>
				<div class="container">
					<Schedules v-if="showSchedules"></Schedules>
					<AssignedSchedules v-if="showAssignedGates"></AssignedSchedules>
					<Carousels v-if="showCarosuel"></Carousels>
					<GateMaintainence v-if="showGateMaintainence"></GateMaintainence>
					<Maintainence :airline="airline" v-if="showMaintainence"></Maintainence>
					<Baggage v-if="showBaggage"></Baggage>
					<AirlineSchedules :airline="airline" v-if="showAirlineSchedule"></AirlineSchedules>
				</div>
			</header>
			<!-- <nav class="navbar navbar-expand-lg navbar-light bg-light">
			<a class="navbar-brand" href="#">Navbar</a> 
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
	
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">Link</a>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
							data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Dropdown
						</a>
						<div class="dropdown-menu" aria-labelledby="navbarDropdown">
							<a class="dropdown-item" href="#">Action</a>
							<a class="dropdown-item" href="#">Another action</a>
							<div class="dropdown-divider"></div>
							<a class="dropdown-item" href="#">Something else here</a>
						</div>
					</li>
					<li class="nav-item">
						<a class="nav-link disabled" href="#">Disabled</a>
					</li>
				</ul>
				<form class="form-inline my-2 my-lg-0">
					<input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
					<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
				</form>
			</div>
		</nav>
		<div class="container" > 
			<nav class="navbar navbar-expand-lg navbar-light"></nav>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button> -->
			<!-- <div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
					</li>
				</ul>
			</div> -->
			<!-- <div class="collapse navbar-collapse" id = "navbarSupportedContent"> 
		 		<ul class="navbar-nav mr-auto">
					<li class= "nav-item"
						@click="showSchedules = true; showCarosuel = false; showGateMaintainence = false; showMaintainence = false;">
						<a class = "nav-link" href="#">Schedules</a>
				</li>
					<li class= "nav-item"
						@click="showGateMaintainence = true; showCarosuel = false; showSchedules = false; showMaintainence = false;">
						<a class = "nav-link" href="#">Gate Maintainence</a>
					</li>
					<li class= "nav-item"
						@click="showMaintainence = true; showCarosuel = false; showSchedules = false; showGateMaintainence = false">
						<a class = "nav-link" href="#">Update Schedule</a>
					</li>
					<li class= "nav-item"
						@click="showCarosuel = true; showSchedules = false; showGateMaintainence = false; showMaintainence = false;">
						<a class = "nav-link" href="#">Carousels</a>
					</li>
				</ul> -->
			<!-- <div class="w-80 container-area">
					<Schedules v-if="showSchedules"></Schedules>
					<Carousels v-if="showCarosuel"></Carousels>
					<GateMaintainence v-if="showGateMaintainence"></GateMaintainence>
					<Maintainence v-if="showMaintainence"></Maintainence>
				</div>
			</div> -->
			<!-- </div> -->
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import Schedules from '@/components/Schedules.vue'
import GateMaintainence from '@/components/gateMaintainence.vue'
import Baggage from '@/components/viewCarousel.vue'
import AssignedSchedules from '@/components/AssignedSchedules.vue'
import Carousels from '@/components/Carousels.vue'
import Maintainence from '@/components/Maintainence.vue';
import AirlineSchedules from '@/components/AirlineSchedules.vue'
import axios from "axios";
import { useRoute } from 'vue-router';
export default {
	name: 'HomeView',
	components: {
		Schedules,
		GateMaintainence,
		Baggage,
		AssignedSchedules,
		Carousels,
		Maintainence,
		AirlineSchedules
		
	},
	props: ["userdata"],
	data() {
		return {
			hours: 1,
			schedule: [],
			choosen: "",
			showSchedules: false,
			showCarosuel: false,
			showMaintainence: false,
			showGateMaintainence: false,
			showBaggage: false,
			showAssignedGates: false,
			showAirlineSchedule: false,
			userType: '',
			airline: ''
			
		}
	},
	setup() {

	},
	mounted() {
		// var navigate = this.$router;
		// this.userInfo = navigate.params;
		// console.log('userinfo here', this.userInfo);
		const route = useRoute()
		let self = this;
		self.userType = route.params.userType;
		self.airline = route.params.airline;
	},
	methods: {
		showData(val) {


		}
	}
}
</script>

<style lang="less" scoped>
 body {margin: 0; padding: 0;}

// body{
//   background: rgb(0, 0, 0);
// //   background: linear-gradient(rgba(243,247,249,1) 0%, rgba(102,163,251,1) 53%);
  
// }

body{
  background: rgb(0, 0, 0);
  background: linear-gradient(rgba(243,247,249,1) 0%, rgba(102,163,251,1) 53%);
  
}

.plane-top{
	background-image: url("@/assets/plane_top.png");
    background-size: cover;
    background-repeat: no-repeat;
	
    // width: 200px;
    height: 100vh;
	background-attachment: fixed;
}
.line-cell {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}



.navigation {
	display: flex;
	flex-direction: row;
	align-items: center;
	flex: 1;
	justify-content: space-around;
	margin: auto;
	box-sizing: border-box;
	// box-shadow: inset 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.15);
	// background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);
	background-color: rgb(0, 123, 255);
	box-shadow: 0 10px 10px -5px;;
}

.navigation a{
	position: relative;
	text-decoration: none;
	font-family: 'Poppins', sans-serif;
	color: #ffffff;
	font-size: 18px;
	letter-spacing: 0.5px;
}
.navigation a:after{
	content: "";
	position: absolute;
	background-color: #000000;
	height: 3px;
	width: 0% ;
	left: 0;
	bottom: -10px;
	transition: 0.3s;
}

.navigation a:hover:after{
	width: 100%;
}
.line-tabs {
	padding: 40px;
	cursor: pointer;
	align-items: center;
	margin:auto;
	// :hover
}
.container{
	margin-top: 30px;
}
</style>


