<template>
	<div class="update">
		<div class="tabs d-flex"
			style="background-color: white; width: 300px; height: 30px ; padding: 20px; align-items: center; border-radius: 10px; margin-left: 35%;">
			<div @click="showMaintainence = true; showAddFlight = false">
				<a href="#update">Update flight</a>
			</div>
			<div @click="showMaintainence = false; showAddFlight = true">
				<a href="#add">Add Flight</a>
			</div>
		</div>
		<div v-if="showMaintainence" class="table-responsive">
			<div>
				<div class="flight-container">Select flight
					<select @change="showflightDetails = true" class="m-4-left" id="usertype" v-model="selectedFlight">
						<option v-for="(item, index) in onTime" :value="item">{{ item.flight }}</option>
					</select>
				</div>
				<div v-if="showflightDetails">
					<div class="header-maintain">
						<div>
							Airlines
						</div>
						<div v-if="selectedFlight.arriving_from">
							Arriving From
						</div>
						<div v-if="selectedFlight.departing_to">
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

					<div class="line-cell_update">
						<div>
							{{ selectedFlight.airline }}
						</div>
						<div>
							<span v-if="selectedFlight.arriving_from">{{ selectedFlight.arriving_from }}</span>
							<span v-if="selectedFlight.departing_to">{{ selectedFlight.departing_to }}</span>
						</div>
						<div>
							{{ selectedFlight.flight }}
						</div>
						<div>
							{{ selectedFlight.status }}
						</div>
						<div>
							{{ selectedFlight.estimated }}
						</div>
						<div>
							{{ selectedFlight.scheduled }}
						</div>
					</div>

					<div class="container-update">
						<div class="delayed-by">
							<div>
								Time
							</div>
							<div class="delay-input">
								<input class="input-delay" type="number" name="delay" id="delay" min="1"
									v-model="delayMin">
								<div @click="updateFlight()" class="delay-btn">
									Update
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="showAddFlight" style = "padding: 10px; font-size: 20px; font-weight: bold;" >
			
			<div style="font-size: large;">
				{{ airline }} Airline
			</div>
			<div class="add-flight">
				<div v-if="showFormError" class="error-text" style="color: red;">
					*All fields are required.
				</div>
				<div class="form-grid">
					<!-- <div>
					{{ airline }}
				</div> -->
				</div>
				<div class="form-grid">
					<div>
						Flight No
					</div>
					<div>
						<input v-model="flightNumber" type="number" name="flightNumber">
					</div>
				</div>
				<div class="form-grid">
					<div>
						Scheduled 
					</div>
					<div>
						<input v-model="scheduledTime" type="datetime-local" name="scheduled-time">
					</div>
				</div>
				<div class="form-grid">
					<div>
					Arrival/Departure
					</div>
					<div>
						<select class="m-5-left" id="usertype" v-model="arrivals">
							<option value="arrival">Arrivals</option>
							<option value="depart">Departures</option>
						</select>
					</div>
				</div>
				<div class="form-grid">
					<div v-if="(arrivals == 'arrival')">
						Arriving From 
					</div>
					<div v-else>
						Departing To 
					</div>
					<div>
						<input v-model="arrivingFrom" type="text" name="arriving_from">
					</div>
				</div>
				<div @click="createFlight()" class="submit-btn m-4-top">
					Submit
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import moment from "moment"
export default {
	name: 'MaintainenceComponent',
	data() {
		return {
			hours: 4,
			schedule: [],
			onTime: [],
			choosen: "",
			selectedFlight: {},
			showflightDetails: false,
			delayMin: 1,
			flightNumber: 0,
			scheduledTime: '',
			arrivingFrom: '',
			showFormError: false,
			showMaintainence: false,
			showAddFlight: false,
			arrivals:'arrival'
		}
	},
	props: {
		userType: String,
		airline: String
	},
	mounted() {
		this.getSchedule();
	},
	methods: {

		flightDetails(val) {
			this.showflightDetails = true;
		},
		updateFlight() {
			let self = this;
			// let date = new Date(self.selectedFlight.estimated);
			// let date = moment(self.selectedFlight.estimated);
			// let setDate = moment().minute(45);
			// let ndate = moment(setDate).format("HH:MM");
			// console.log(setDate,'date');
			// date.setMinutes(date.getMinutes() + self.delayMin);
			// let newDate = date.toISOString();
			// let formatDate = moment(newDate).format("HH:MM");
			// let formatDate = moment.duration().add(self.delayMin, date);

			const event = new Date();
			console.log(event.toString());
			// expected output: Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)
			// (note: your timezone may vary)

			console.log(event.toLocaleDateString());

			let ts = event.toLocaleDateString() + " " + self.selectedFlight.scheduled + ":000-08:00"
			console.log(ts)
			// ts = event.toLocaleDateString() + " 08:00"
			let newdate = new Date(ts)
			console.log(newdate.toISOString());
			axios
				.post("http://www.apex-ams.me/updateSchedule", {
					"airline": self.selectedFlight.airline,
					"flight": self.selectedFlight.flight,
					"scheduled": newdate.toISOString(),
					"estimated": moment(this.formatDate).local().toISOString(),
					"status": 'Delayed',
					"departing_to": self.selectedFlight.departing_to,
					"arriving_from": self.selectedFlight.arriving_from
				})
				.then(function (response) {
					console.log(response.data.data);
					self.onTime = [];
					self.getSchedule();
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		},
		getSchedule(val) {
			const self = this;
			self.schedule = [];
			self.onTime = [];
			self.selectedFlight = {};
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
						if (x.status == 'On-Time' && x.airline == self.airline) {
							arr.push(x)
						}
					});
					self.onTime = arr;
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		},
		createFlight() {
			let date = moment(this.scheduledTime).toISOString()
			if (this.flightNumber == '' || date == '' || this.arrivingFrom == '') {
				this.showFormError = true;
			} else {
				this.showFormError = false;
				// moment().tz("America/Los_Angeles").format();
				let date = this.scheduledTime
				console.log('create', this.airline, this.flightNumber, date, this.arrivingFrom);
				var data = {};
				if(this.arrivals == 'arrival') {
					data = {
						"airline": this.airline,
						"flight": this.flightNumber,
						"scheduled": date,
						"estimated": date,
						"status": "On-Time",
						"arriving_from": this.arrivingFrom
					}
				} else {
					data = {
						"airline": this.airline,
						"flight": this.flightNumber,
						"scheduled": date,
						"estimated": date,
						"status": "On-Time",
						"departing_to": this.arrivingFrom
					}
				}
				axios
					.post("http://www.apex-ams.me/addSchedule", {
						...data
					})
					.then(function (response) {
						console.log(response);
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
}
</script>

<style lang="less" scoped>
.update {
	background-color: rgb(255, 244, 228);
	width: 1000px;
	height: 400px;
	margin-left: 5.5%;
	padding: 10px;
	box-shadow: 0px 0px 10px;
	border-radius: 10px;
	align-items: center;
}

.line-cell_update {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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

.flight-container {
	font-weight: bold;
	font-size: 20px;
	padding: 10px;
}

// .container-update{
// 	background-color: white;
// 	width: 300px;
// 	height: 150px;
// 	margin-left: 35%;
// 	margin-top: 20px;

// 	align-items: center;
// 	border-radius: 10px;
// 	box-shadow: 0px 0px 10px;
// }
.delay-btn {
	background-color: rgb(0, 203, 254);
	padding: 10px;
	margin-top: 20px;
	margin-left: 40%;
	margin-right: 40%;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	font-size: 20px;
	box-shadow: 0px 0px 10px;
	border-radius: 10px;
	font-weight: bold;
}

.delay-input {
	padding: 10px;
}

.input-delay {
	border-radius: 5px;
	align-items: center;
	outline: 2px;
}

.delayed-by {
	margin-top: 10px;
	font-weight: bold;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	font-size: 20px;
}

.header-maintain {
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
	background-color: rgb(0, 203, 254);
	padding: 10px;
	margin-top: 20px;
}

.m-4-left {
	border-radius: 10px;
	// border: none;
	width: 150px;
	background-color: #fff;
	outline-color: black;
	align-items: center;
}

.update {
	margin-left: 10%;
}

// .table-schedule{
// 	margin: 10px 70px 70px;
//     box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
// }

.update a {
	padding-right: 100px;
	// justify-content: center;
	position: relative;
	font-size: 18px;
	font-family: 'Poppins', sans-serif;
	font-weight: bold;
	color: #000000;
}

.update a:after {
	content: "";
	position: absolute;
	background-color: rgb(254, 112, 4);
	height: 3px;
	width: 0%;
	left: 0;
	// bottom: -10px;
	transition: 0.3s;
}

.update a:hover:after {
	width: 45%;
}

.add-flight {
	background-color: white;
	width: 600px;
	height: 300px;
	margin-top: 10px;
	align-items: center;
	margin-left: 20%;
	border-radius: 10px;

}

.form-grid {
	padding: 10px;
	font-weight: bold;
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.submit-btn{
	background-color: #05b4ff;
	height: fit-content;
	width: fit-content ;
	padding: 10px;
	border-radius: 10px;
	margin-left: 43%
}
</style>
