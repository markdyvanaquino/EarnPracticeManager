import { Component } from '@angular/core';
import { UserService } from './user.service';
import { LandmarkService } from './landmark.service';
import { User }  from './user';
import { Landmark } from './landmark';

declare var google: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css','app/bootstrap.min.css'],
    providers: [UserService, LandmarkService]
})
export class AppComponent {
    title = 'Landmark Remark';
    errorMessage: string;
    users: User[];
    selectedUserLandmarks: Landmark[];
    listedLandmarks: Landmark[];
    selectedUserId: number;
    showMap: boolean;
    showList: boolean;
    userSelected: boolean;

    constructor(private userService: UserService, private landmakrService: LandmarkService) { //inject services
        this.showMap = true;
        this.showList = false;
        this.userSelected = false;
    }

    /* show/hide map/list */ 
    toggleShow(showStr: string) {
        if (showStr == "show map")
        {
            this.showMap = true;
            this.showList = false;
            if (this.userSelected) { //user was selected
                this.getUserLandmarks(this.selectedUserId);
            }
            else { // no user selected
                navigator.geolocation.getCurrentPosition(this.initialiseLocation);
            }
        }
        else {
            this.showMap = false;
            this.showList = true;
            this.getDisplayedLandmarksList(""); // reload list
        }

    }

    initialiseLocation = function (location) {
        let currentLocation = { lat: location.coords.latitude, lng: location.coords.longitude };
        // get initial location and save in hidden inputs
        (<HTMLInputElement>document.getElementById("latitude")).value = location.coords.latitude.toString();
        (<HTMLInputElement>document.getElementById("longitude")).value = location.coords.longitude.toString();
    }

    selectUser(selectedUserId) {
        if (selectedUserId != 0)
        {
            this.userSelected = true;
            this.selectedUserId = selectedUserId;
            this.getUserLandmarks(selectedUserId);
        }
        else {
            this.userSelected = false;
        }
        
    }

    getUserLandmarks(userId: number) {
        // get location from hidden input
        let latitude = Number.parseFloat((<HTMLInputElement>document.getElementById("latitude")).value);
        let longitude = Number.parseFloat((<HTMLInputElement>document.getElementById("longitude")).value);
        let currentLocation = { lat: latitude, lng: longitude };
        // load user landmarks and refresh map with locations plus current location
        this.landmakrService.getUserLandmarks(userId)
            .subscribe(
            landmarks => this.selectedUserLandmarks = landmarks,
            error => this.errorMessage = <any>error,
            () => this.displayUserLandmarks(currentLocation, this.selectedUserLandmarks)
        );
    }

    /* display list */
    getDisplayedLandmarksList(searchStr:string) {
        this.landmakrService.getAllLandmarks(searchStr)
            .subscribe(
            landmarks => this.listedLandmarks = landmarks,
            error => this.errorMessage = <any>error
            );
    }

    /* display user landmarks on the map */
    displayUserLandmarks(currentLocation, landmarks) {
        var mapProp = {
            center: currentLocation,
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapProp);
        // Create a marker and set its position to current location.
        var marker = new google.maps.Marker({
            map: map,
            position: currentLocation,
            title: 'You are here !'
        });
        /* add user landmarks */
        if (landmarks) {
            for (var i = 0; i<landmarks.length; i++) {
                var image = 'app/images/beachflag.png';
                new google.maps.Marker({
                    map: map,
                    position: { lat: Number.parseFloat(landmarks[i].latitude), lng: Number.parseFloat(landmarks[i].longitude) },
                    title: landmarks[i].note,
                    icon: image
                });
            }
            landmarks = null;
        }
    }

    /* get system users to populate dropdown list */
    getUsers() {
        this.userService.getUsers()
            .subscribe(
            users => this.users = users,
            error => this.errorMessage = <any>error);
    }

    /* Add landmark to user current location - post to backend*/
    addLandmark() {
            let latitude = (<HTMLInputElement>document.getElementById("latitude")).value;
            let longitude = (<HTMLInputElement>document.getElementById("longitude")).value;
            let note = (<HTMLInputElement>document.getElementById("note")).value;
            if (!this.selectedUserId || !note) { return; }
            let landmark = new Landmark(this.selectedUserId, note, longitude, latitude,null);
            this.landmakrService.addLandmark(landmark)
                .subscribe(
                () => this.getUserLandmarks(this.selectedUserId),
                error => this.errorMessage = <any>error);
    }

    /* get current location.
       Load all users and all landmarks */
    ngOnInit() {
        navigator.geolocation.getCurrentPosition(this.initialiseLocation);
            this.getUsers();
            this.getDisplayedLandmarksList("");
    }
}