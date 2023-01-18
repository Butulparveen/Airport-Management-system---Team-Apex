<template>
	<!-- <div class="schedules">
		<div class="tabs d-flex">
			<div @click="getTerminal('T1'); this.choosen = 'Terminal 1'">
				Terminal 1
			</div>
			<div @click="getTerminal('T2'); this.choosen = 'Terminal 2'">
				Terminal 2
			</div>
            <div @click="getTerminal('T3'); this.choosen = 'Terminal 3'">
				Terminal 3
			</div>
		</div>
		<div v-if="showGates">
			{{this.choosen}} Gates
			<div v-for="(item, index) in this.gates" :key="index">
				<div class="gates-line-cell">
					<div>
						{{item.gate}}
					</div>
                    <div>
                        {{item.isUnderMaintainance}}
                    </div>
                    <div>
                        <div @click="changeMaintainence(item.gate, item.isUnderMaintainance)" v-if="item.isUnderMaintainance == false">
                            Perform Maintainence
                        </div>
                        <div v-else @click="changeMaintainence(item.gate, item.isUnderMaintainance)">
                            Finish Maintainence
                        </div>
                    </div>					     
				</div>
			</div>
		</div>
	</div> -->
	<div class="terminals">
		<div class="tabs d-flex">
			<div @click="getTerminal('T1'); this.choosen = 'Terminal 1'">
				<a href="#term1">Terminal 1</a>
			</div>
			<div @click="getTerminal('T2'); this.choosen = 'Terminal 2'">
				<a href="#term2">Terminal 2</a>
			</div>
			<div @click="getTerminal('T3'); this.choosen = 'Terminal 3'">
				<a href="#term3">Terminal 3</a>
			</div>
		</div>
	</div>
	<div v-if="showGates">
			<div class="terminal-card">{{this.choosen}} Gates
				<div v-for="(item, index) in this.gates" :key="index">
					<div class="gates-line-cell">
						<div>
							{{item.gate}}
						</div>
						<div >
							<div style="font-size: 18px;"
								v-if="item.isUnderMaintainance == false">
								Functional
							</div>
							<div style="font-size: 18px;" v-else>
								Under Maintainence
							</div>
						</div>
						
						<!-- <div>
							<label class="switch">
								<input @change="changeMaintainence(item.gate, item.isUnderMaintainance)" v-model="changeMaintain[index]" type="checkbox">
								<span class="slider round"></span>
							</label>
						</div> -->
						<div>
							<div @click="changeMaintainence(item.gate, item.isUnderMaintainance)"
								v-if="item.isUnderMaintainance == false" class="maintain-button-true">
								Enable
							</div>
							<div v-else @click="changeMaintainence(item.gate, item.isUnderMaintainance)" class="maintain-button-false">
								Disable
							</div>
						</div>
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
	name: 'ScheduleComponent',
	// components: {
	// 	HelloWorld
	// },
	data() {
        return {
			gates: [],
			choosen: "",
			showT1: false,
			showT2: false,
            showT3: false,
            gatesArray: [],
            showGates: false,
            selectedGate:'',
			changeMaintain: [],
        }
    },
	methods: {

        changeMaintainence(gate, prevstatus) {
            const self = this;
            axios
				.post("http://www.apex-ams.me/updateGateStatus", {
                    "gate" : gate,
                    "isUnderMaintainance" : !prevstatus
                })
				.then(function (response) {
					console.log(response);
                    self.getTerminal(self.selectedGate);
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					// always executed
				});
        },
		getTerminal(val) {
			const self = this;
			// if(val == 'T1') {
			// 	self.showT1 = true;
			// 	self.showT2 = false;
            //     self.showT3 = false;

			// } else if(val == 'T2'){
			// 	self.shpwT1 = false;
			// 	self.showT2 = true;
            //     self.showT3 = false;
			// }else {
            //     self.showT1 = false;
            //     self.showT2 = false;
            //     self.showT3 = true;
            // }
            self.showGates = false;
			self.gates = [];
            self.selectedGate = val;
			axios
				.get("http://www.apex-ams.me/listAllGates")
				.then(function (response) {
					console.log(response);
                    self.showGates = true;
					self.gatesArray = response.data;
                    console.log(val);
                    let tarr = []
                    self.gatesArray.forEach((x,i)=> {
                            if(x.terminal == val) {
                                tarr.push(x);
                            }
                        });
                    self.gates = tarr;
                    
                    // if(val == 'T1') {
                    //     self.gatesArray.forEach((x,i)=> {
                    //         if(x.terminal == )
                    //     })
                    // }


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
.gates-line-cell {
	display: grid;
    grid-template-columns: 1fr 1fr 1fr;
	
	border-radius: 10px;
	font-size: 22px;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	padding: 30px;
	margin-left: 20px;
	margin-right: 20px;

}
.terminals{
	margin-left: 30%;
	padding: 10px;
	margin-right: 30%;
	background-color:whitesmoke;
	box-shadow: 0 0 10px;
	border-radius: 10px;
	
}

.terminals a{
	padding-right:100px;
	justify-content: center;
	position: relative;
	font-size: 18px;
	font-family: 'Poppins', sans-serif;;
	font-weight: bold;
	color: #000000;
}

.terminals a:after{
	content: "";
	position: absolute;
	background-color: rgb(254, 112, 4);
	height: 3px;
	width: 0% ;
	left: 0;
	// bottom: -10px;
	transition: 0.3s;
}

.terminals a:hover:after{
	width: 45%;
}

.terminal-card{
	background-color: antiquewhite;
	width: 700px;
	height: 520px;
	margin-top: 40px;
	margin-left: 23%;
	font-size: 28px;
	font-weight: bold;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0px 0px 10px;
}





/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.maintain-button-true{
	background-color: #88f793;
	height: fit-content;
	width: 100px;
	padding: 5px;
	border-radius: 10px;
	font-size: 19px;
	color: #000000;
	cursor: pointer;
}
.maintain-button-false{
	background-color: #ff6f6f;
	height: fit-content;
	width: 100px;
	padding: 5px;
	border-radius: 10px;
	font-size: 19px;
	color: #000000;
	cursor: pointer;
}
</style>
