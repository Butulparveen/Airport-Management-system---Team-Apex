<template>
	<div class="schedules">
		<div class="tabs d-flex" style = "background-color: white; width: 658px; height: 30px ; padding: 20px; align-items: center; border-radius: 10px; margin-left: 15%;box-shadow: 0px 0px 10px;">
			<div @click="getSchedule('departures'); this.choosen = 'Departures' ">
				<a href="#depart">Departures</a>
			</div>
			<div @click="getSchedule('arrivals'); this.choosen = 'Arrivals'">
				<a href="#arrive">Arrivals</a>
			</div>
			<div>
				<div class="dropdown-duration">Duration
					<select class="m-5-left" id="usertype">
						<option value="1">1 hour</option>
						<option value="2">2 hours</option>
						<option value="4">4 hours</option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div
			style="border-top-right-radius: 10px ;border-top-left-radius: 10px;font-weight: bold; font-size: 30px; padding: 10px; color: black; background-color:rgb(0, 203, 254); width: fit-content; height: fit-content; margin-left: 40%; margin-top: 10px;">
			{{ this.choosen }}</div>
		<div>
			<div class="header" >
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
		<div>
			<div class="line-cell"  v-for="(item, index) in airSchedule" :value="item">
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
			</div>
		</div>
	
		<div style="border-top-right-radius: 10px ;border-top-left-radius: 10px;font-weight: bold; font-size: 30px; padding: 10px; color: black; background-color:rgb(0, 203, 254); width: fit-content; height: fit-content; margin-left: 43.5%; margin-top: 10px;">{{ this.choosen }}</div>
		<div>
			<div class="header">
				<div>
					Airline
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
		<div >
			<div class="line-cell" v-for="(item, index) in airSchedule" :value="item">
				<div>
					{{ item.airline }}
				</div>
				<div>
					{{ item.arriving_from }}
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
			</div>
		</div>
</template>

<script>
 import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
export default {
	name: 'ScheduleComponent',
	// components: {
	// 	HelloWorld
	// },
	data() {
		return {
			hours: 1,
			schedule: [],
			choosen: "",
			showArrivals: false,
			showDepartures: false,
			airSchedule: []

		}
	},
	props: {
		userType: String,
		airline: String
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
			self.airSchedule = [];
			axios
				.post("http://www.apex-ams.me/getSchedule", {
					"flow": val,
					"forNextHours": this.hours
				})
				.then(function (response) {
					console.log(response.data.data);
					self.schedule = response.data.data;
					let arr = []
					self.schedule.forEach((x, i) => {
						if (x.airline == self.airline) {
							arr.push(x)
						}
					});
					self.airSchedule = arr;
					console.log(self.airSchedule)

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

<style>
.header{
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

.line-cell {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	border-radius: 5px;
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

.schedules a {
	padding-right: 100px;
	justify-content: center;
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
	bottom: -10px;
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