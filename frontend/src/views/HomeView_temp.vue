
<template>
	<div class="d-flex">
		<div class="w-30 index-tabs">
			<va-sidebar v-for="(item,index) in sidenav" :key="index">
				<va-sidebar-item :active="item.active" @click="activeSide(item)">
					<va-sidebar-item-content>	
						<!-- <va-icon name="schedule" /> -->
						<va-sidebar-item-title>
							{{item.name}}
						</va-sidebar-item-title>
					</va-sidebar-item-content>
				</va-sidebar-item>
			</va-sidebar>
		</div>
		<div class="container-area">
			<Schedules v-if="showSchedules"></Schedules>
			<Carousels v-if="showCarosuel"></Carousels>
			<GateMaintainence v-if="showGateMaintainence"></GateMaintainence>
			<Maintainence v-if="showMaintainence"></Maintainence>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import Schedules from '@/components/Schedules.vue'
import Carousels from '@/components/Carousels.vue'
import GateMaintainence from '@/components/gateMaintainence.vue';
import Maintainence from '@/components/Maintainence.vue';
import axios from "axios";
import { useRoute } from 'vue-router';
export default {
	name: 'HomeView',
	components: {
		Schedules,
		Carousels,
		GateMaintainence,
		Maintainence
	},
	props:["userdata"],
	data() {
		return {
			hours: 1,
			schedule: [],
			sidenav:[{"name": 'Carousels', "active": false},{"name": 'Update', "active": false}, {"name": 'Schedules', "active": true}, {"name": 'Gate', "active": false}],
			choosen: "",
			showSchedules: false,
			showCarosuel: false,
			showMaintainence: false,
			showGateMaintainence: false,
			userType: '',
			airline: ''
		}
	},
	setup(){
		
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

		},
		activeSide(val) {
			this.showSchedules = false;
			this.showCarosuel = false;
			this.showMaintainence = false;
			this.showGateMaintainence = false;
			if(val.name == 'Carousels') {
				this.showCarosuel = true;
			} else if(val.name == 'Update'){
				this.showMaintainence = true;
			} else if(val.name == 'Schedules') {
				this.showSchedules = true;
			} else if(val.name == 'Gate') {
				this.showGateMaintainence = true;
			}
			this.sidenav.forEach((x,i)=>{
				if(x.name == val.name) {
					x.active = true;
				} else {
					x.active = false;
				}
			})
		}
	}
}
</script>

<style lang="less">
.line-cell {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}
.line-tabs {
	padding: 15px;
	cursor: pointer;
}
</style>
