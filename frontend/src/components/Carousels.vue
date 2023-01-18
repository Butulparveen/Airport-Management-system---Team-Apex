<template>
	<div class="carousel-scroll">
		<div class="relative header-cont">
					<div class="header">
						<div>
							Airlines
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
							Carousel No
						</div>
						<div>
							Assign
						</div>
					</div>
				</div>
		<div class="carousels">
			<div class="loading" v-if="setLoading">
			</div>
			<div>
				{{ this.choosen }}
				
				<div v-for="(item, index) in this.schedule" :key="index">
					<div class="line-cell">
						<div>
							{{ item.airline }}
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
							<select id="bagagge" v-model="selectedLane[index]">
								<!-- @change="updatebag(selectedLane[index], item._id)" -->
								<option v-for="(item) in this.availableLanes">{{ item }}</option>
							</select>
						</div>
						<div>
							<div @click="updatebag(selectedLane[index], item._id)" class="assign-btn">
								Assign
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
// @ is an alias to /src
import { createDOMCompilerError } from "@vue/compiler-dom";
import axios from "axios";
export default {
	name: 'MaintainenceComponent',
	data() {
		return {
			hours: 1,
			schedule: [],
			choosen: "",
			availableLanes: [],
			selectedLane: [],
			setLoading: false
		}
	},
	methods: {
		getArrivals() {
			const self = this;
			self.schedule = [];
			axios
				.get("http://www.apex-ams.me/scheduleWithoutCarousel", {
				})
				.then(function (response) {
					console.log(response.data.data);
					self.schedule = response.data.data;

				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		},
		getCarousles() {
			const self = this;
			self.availableLanes = [];
			axios
				.get("http://www.apex-ams.me/listAvailableCarousels")
				.then(function (response) {
					console.log(response.data.carousels);
					self.availableLanes.push('none');
					self.availableLanes = response.data.carousels;
					self.setLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		},
		updatebag(val, id) {
			this.setLoading = true;
			axios
				.post("http://www.apex-ams.me/assignCarousel", {
					"carousel": val,
					"flightId": id
				})
				.then(function (response) {
					console.log(response);
					this.getCarousles();
					this.getArrivals();
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		}
	},
	created() {
		this.getArrivals();
		this.getCarousles();
	},

}
</script>


<style lang="less" scoped>
.header {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	// border-top-left-radius: 10px;
	// border-top-right-radius: 10px;
	font-size: 22px;
	font-weight: bold;
	border: none;
	border-collapse: collapse;
	width: 100%;
	max-width: 100%;
	white-space: nowrap;
	background-color: rgb(0, 203, 254);
	padding: 10px;
	position: absolute;
}

.line-cell {
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

.loading {
	background-color: rgba(0, 0, 0, 0.118);
	z-index: 6;
	cursor: no-drop;
}

.carousels {
	margin: 10px 70px 70px;
	box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
	height: 80vh;
	overflow: auto;
}

.assign-btn {
	padding: 5px 15px;
	// border: 1px solid red;
	border-radius: 4px;
	background: rgb(31, 188, 255);
	color: black;
	cursor: pointer;
}

.header-cont {
	margin: 10px 70px 70px;
}

// .fl-table {
//     border-radius: 5px;
//     font-size: 12px;
//     font-weight: normal;
//     border: none;
//     border-collapse: collapse;
//     width: 100%;
//     max-width: 100%;
//     white-space: nowrap;
//     background-color: white;
// }

// .fl-table td, .fl-table th {
//     text-align: center;
//     padding: 8px;
// }

// .fl-table td {
//     border-right: 1px solid #f8f8f8;
//     font-size: 12px;
// }

// .fl-table thead th {
//     color: #ffffff;
//     background: #4FC3A1;
// }


// .fl-table thead th:nth-child(odd) {
//     color: #ffffff;
//     background: #324960;
// }

// .fl-table tr:nth-child(even) {
//     background: #F8F8F8;
// }
</style>
