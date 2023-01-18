<template>

	<!-- <div class="schedules">
		<div class="tabs d-flex">
			<div @click="getSchedule('departures'); this.choosen = 'Departures' ">
				Departures
			</div>
			<div @click="getSchedule('arrivals'); this.choosen = 'Arrivals'">
				Arrivals
			</div>
			<div>
				<div>Duration </div>
				<select class="m-5-left" id="usertype" v-model="hours">
					<option value="1">1 hour</option>
					<option value="2">2 hours</option>
					<option value="4">4 hours</option>
				</select>
			</div>
		</div>
		<div v-if="showDepartures">
			{{this.choosen}}
			<div>
				<div class="line-cell">
					<div>
						Airlines
					</div>
					<div>
						Departing To
					</div>
					<div>
						Flight No
					</div>
					<div>
						Status
					</div>
					<div>
						Estimated.
					</div>
					<div>
						Scheduled
					</div>						     
				</div>
			</div>
			<div v-for="(item, index) in this.schedule" :key="index">
				<div class="line-cell">
					<div>
						{{item.airline}}
					</div>
					<div>
						{{item.departing_to}}
					</div>
					<div>
						{{item.flight}}
					</div>
					<div>
						{{item.status}}
					</div>
					<div>
						{{item.estimated}}
					</div>
					<div>
						{{item.scheduled}}
					</div>						     
				</div>
			</div>
		</div>
		<div v-if="showArrivals">
			{{this.choosen}}
			<div>
				<div class="line-cell">
					<div>
						Airlines
					</div>
					<div>
						Arriving From
					</div>
					<div>
						Flight No
					</div>
					<div>
						Status
					</div>
					<div>
						Estimated.
					</div>
					<div>
						Scheduled
					</div>						     
				</div>
			</div>
			<div v-for="(item, index) in this.schedule" :key="index">
				<div class="line-cell">
					<div>
						{{item.airline}}
					</div>
					<div>
						{{item.arriving_from}}
					</div>
					<div>
						{{item.flight}}
					</div>
					<div>
						{{item.status}}
					</div>
					<div>
						{{item.estimated}}
					</div>
					<div>
						{{item.scheduled}}
					</div>						     
				</div>
			</div>
		</div>
	</div> -->
	<!-- <div class="schedules">
		<div class="tab d-flex">
			<div @click="getSchedule('departures'); this.choosen = 'Departures' ">
				<va-button preset="primary" class="mr-4 mb-2">Departures</va-button>
			</div>
			<div @click="getSchedule('arrivals'); this.choosen = 'Arrivals'">
				<va-button preset="primary" class="mr-4 mb-2">Arrivals</va-button>
			</div>
		</div>
		<div>
				<div>Duration </div>
				<select class="m-5-left" id="usertype" v-model="hours">
					<option value="1">1 hour</option>
					<option value="2">2 hours</option>
					<option value="4">4 hours</option>
				</select>
			</div>
	</div> -->
	<div class="schedules">
		<div class="tabs d-flex" style = "background-color: white; width: 300px; height: 30px ;border-radius: 10px; margin-left: 30%; padding: 5px; box-shadow: 0px 0px 10px;">
			<div @click="getSchedule('departures'); this.choosen = 'Departures' ">
				<a href="#depart">Departures</a>
			</div>
			<div @click="getSchedule('arrivals'); this.choosen = 'Arrivals'">
				<a href="#arrive">Arrivals</a>
			</div>
			<!-- <div>
				<div class="dropdown-duration">Duration
					<select class="m-5-left" id="usertype" v-model="hours">
						<option value="1">1 hour</option>
						<option value="2">2 hours</option>
						<option value="4">4 hours</option>
					</select>
				</div>
			</div> -->
		</div>
	</div>
	<div class="schedule-table" v-if="showDepartures">
		<div
			style="border-top-right-radius: 10px ;border-top-left-radius: 10px;font-weight: bold; font-size: 30px; padding: 10px; color: black; background-color:rgb(0, 203, 254); width: fit-content; height: fit-content; margin-left: 43.5%; margin-top: 10px;">
			{{ this.choosen }}</div>
		<div>
			<div class="header-assign">
				<div>
					Airlines
				</div>
				<div>
					Departing To
				</div>
				<div>
					Flight No
				</div>
				<div>
					Status
				</div>
				<div>
					Estimated.
				</div>
				<div>
					Scheduled
				</div>
				<div>
					Gate
				</div>
			</div>
		</div>
		<div v-for="(item, index) in this.scheduledDepartures" :key="index">
			<div class="line-cell-assign">
				<div>
					{{ item.airline }}
				</div>
				<div>
					{{ item.departing_to }}
				</div>
				<div>
					{{ item.flight }}
				</div>
				<div>
					{{ item.status }}
				</div>
				<div>
					{{ item.estimated }}
				</div>
				<div>
					{{ item.scheduled }}
				</div>
				<div>
					{{ item.gate }}
				</div>
			</div>
		</div>
	</div>
	<div v-if="showArrivals">
		<div style="border-top-right-radius: 10px ;border-top-left-radius: 10px;font-weight: bold; font-size: 30px; padding: 10px; color: black; background-color:rgb(0, 203, 254); width: fit-content; height: fit-content; margin-left: 44%; margin-top: 10px;">{{ this.choosen }}</div>
		<div>
			<div class="header-arrival">
				<div>
					Airlines
				</div>
				<!-- <div>
					Arriving From
				</div> -->
				<div>
					Flight No
				</div>
				<div>
					Status
				</div>
				<div>
					Estimated.
				</div>
				<div>
					Scheduled
				</div>
				<div>
					Gate
				</div>
			</div>
		</div>
		<div v-for="(item, index) in this.scheduledArrivals" :key="index">
			<div class="line-cell-arrival">
				<div>
					{{ item.airline }}
				</div>
				<!-- <div>
					{{ item.arriving_from }}
				</div> -->
				<div>
					{{ item.flight }}
				</div>
				<div>
					{{ item.status }}
				</div>
				<div>
					{{ item.estimated }}
				</div>
				<div>
					{{ item.scheduled }}
				</div>
				<div>
					{{ item.gate }}
				</div>
			</div>
		</div>

	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
export default {
	name: 'AssignedSchedules',
	// components: {
	// 	HelloWorld
	// },
	data() {
		return {
			hours: 1,
			schedule: [],
			scheduledDepartures:[],
			scheduledArrivals:[],
			choosen: "",
			showArrivals: false,
			showDepartures: false,
		}
	},
	methods: {
		getSchedule(val) {
			const self = this;
			if (val == 'arrivals') {
				self.showArrivals = true;
				self.showDepartures = false;
			} else {
				self.showDepartures = true;
				self.showArrivals = false;
			}
			self.schedule = [];
			axios
				.get("http://www.apex-ams.me/showGateStatus")
				.then(function (response) {
					console.log(response.data.data);
					let data =  response.data.data;
					let arrivals = [];
					let departures = [];
					data.forEach((x,i)=> {
						if(x.departing_to == undefined) {
							arrivals.push(x);
						} else {
							departures.push(x);
						}
					});
					self.scheduledArrivals = arrivals;
					self.scheduledDepartures = departures;
					console.log(self.scheduledArrivals, self.scheduledDepartures)
					// self.schedule = response.data.data;

				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		}
	}
}
</script>

<style lang="less" scoped>
.header-assign{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	border-radius: 5px;
    font-size: 22px;
    font-weight: bold;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color:rgb(0, 203, 254);
	padding: 10px;
}
.line-cell-assign{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	// border-radius: 5px;
    font-size: 20px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
	padding: 10px;
	overflow-y: auto;
}
.line-cell-arrival{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	// border-radius: 5px;
    font-size: 20px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
	padding: 10px;
	overflow-y: auto;
}

.header-arrival{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	border-radius: 5px;
    font-size: 22px;
    font-weight: bold;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color:rgb(0, 203, 254);
	padding: 10px;
	
}

.schedules {
	margin-left: 10%;
}

// .table-schedule{
// 	margin: 10px 70px 70px;
//     box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
// }

.schedules a {
	padding-right: 100px;
	// justify-content: center;
	position: relative;
	font-size: 18px;
	font-family: 'Poppins', sans-serif;
	font-weight: bold;
	color: #000000;
}

.schedules a:after {
	content: "";
	position: absolute;
	background-color: rgb(254, 112, 4);
	height: 3px;
	width: 0%;
	left: 0;
	// bottom: -10px;
	transition: 0.3s;
}

.schedules a:hover:after {
	width: 45%;
}

.dropdown-duration {
	position: relative;
	color: #000000;
	font-size: 18px;
	font-weight: bold;
	font-family: 'Poppins', sans-serif;
}

.m-5-left {
	border-radius: 10px;
	border: none;
	width: 150px;
	background-color: rgb(255, 241, 216);
	
	align-items: center;
}
</style>
