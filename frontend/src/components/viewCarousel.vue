<template>
	<div class="carousels">
		<div class="loading" v-if="setLoading">
        </div>
		<div>
			{{this.choosen}}
			<div >
				<div class="header-view">
					<div>
						Airlines
					</div>
					<div>
						Flight No
					</div>
                    <div>
                        Carousel No
                    </div>						     
				</div>
			</div>
			<div v-for="(item, index) in this.schedule" :key="index">
				<div class="line-cell-carousel">
					<div>
						{{item.airline}}
					</div>
					<div>
						{{item.flight}}
					</div>
					<div>
						{{item.carousel}}
					</div>
                    <!-- <div v-for="(item, index) in this.selectedLane" :key="index">
							<div class="line-cell">
								{{item.carousel}}
							</div>
                    </div>						      -->
				</div>
			</div>
		</div>
		<!-- <div class="loading" v-if="setLoading">
		</div>
		
			{{ this.choosen }}
			<div>
				<table class="f1-table">
					<thead>
						<tr>
							<th>
								Airlines
							</th>
							<th>
								Flight No
							</th>
							<th>
								Status
							</th>
							<th>
								Estimated.
							</th>
							<th>
								Scheduled
							</th>
							<th>
								Carousel No
							</th>
						</tr>
					</thead>
				</table>
			</div>
			<div v-for="(item, index) in this.schedule" :key="index">
				<table class="f1-table">
					<thead>
						<tr>
							<td>
								{{ item.airline }}
							</td>
							<td>
								{{ item.flight }}
							</td>
							<td>
								{{ item.status }}
							</td>
							<td>
								{{ item.estimated }}
							</td>
							<td>
								{{ item.scheduled }}
							</td>
							<td>
								<select id="bagagge" @change="updatebag(selectedLane[index], item._id)"
									v-model="selectedLane[index]">
									<option v-for="(item) in this.availableLanes">{{ item }}</option>
								</select>
							</td>
						</tr>
					</thead>
				</table>
			</div> -->
		
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
		getCarousel() {
			const self = this;
			self.schedule = [];
			axios
				.get("http://www.apex-ams.me/showBaggageClaim")
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
		showCarousel() {
			const self = this;
			self.availableLanes = [];
			axios
				.get("http://www.apex-ams.me/showBaggageClaim")
				.then(function (response) {
					console.log(response.data.carousel);
					self.availableLanes.push('none');
					self.availableLanes = response.data.carousel;
					self.setLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
		},
		// updatebag(val, id) {
		// 	this.setLoading = true;
		// 	axios
		// 		.post("http://www.apex-ams.me/assignCarousel", {
		// 			"carousel": val,
		// 			"flightId": id
		// 		})
		// 		.then(function (response) {
		// 			console.log(response);
		// 			this.getCarousles();
		// 			this.getArrivals();
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error);
		// 		})
		// 		.finally(function () {
		// 			// always executed
		// 		});
		// }
	},
	created() {
		this.getCarousel();
		this.showCarousel();
	},

}
</script>

<style lang="less" scoped>
.header-view{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
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
.line-cell-carousel {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
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

.carousels{
    margin: 10px 70px 70px;
    box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
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

