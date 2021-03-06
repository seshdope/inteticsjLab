import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {promise} from "selenium-webdriver";
import {error} from "util";
import {reject} from "q";
import {JobsService} from "./jobs.service";

@Injectable({
  providedIn: 'root'
})
export class AndroidService {
  androids;
  editMode = false;
  skills = [];
  editedAndroid;

  addSkill(skill) {

    this.skills.push(skill);
  }

  deleteSkill(skill) {
    const index = this.skills.indexOf(skill);
    this.skills.splice(index, 1);
  }

  getSkills() {
    return this.skills;
  }

  clearSkills() {
    this.skills = [];
  }

  constructor(private httpClient: HttpClient, private jobService: JobsService) {

  }

  enableEditMode() {
    this.editMode = true;
  }

  disableEditMode() {
    this.editMode = false;
  }

  getEditMode() {
    return this.editMode;
  }

  getAndroid(index) {
    return this.androids[index];
  }

  addAndroid(android) {
    this.androids.push(android);
  }

  loadAndroids() {
    return new Promise((resolve, reject) => {
      this.httpClient.get('http://localhost:3000/api/android/all').subscribe((response) => {
        this.androids = response['data'];
        resolve(response['data']);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  deleteAndroid(id) {
    return new Promise(async (resolve, reject) => {
      this.androids = this.removeByKey(this.androids, {key: '_id', value: id});
      await this.httpClient.delete(`http://localhost:3000/api/android/${id}`).subscribe((response) => {
        resolve(this.androids);
      });
    });
  }

  removeByKey(array, params) {
    array.some(function (item, index) {
      return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
    });

    return array;
  }

  createAndroid(android) {
    this.androids.push(android);
    return new Promise((resolve, reject) => {
      this.httpClient.post('http://localhost:3000/api/android', android).subscribe((response) => {
        resolve(response['data']);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  updateByKey(array, params, newAndroid) {
    array.some(function (item, index) {
      return (array[index][params.key] === params.value) ? !!(array.splice(index, 1, newAndroid)) : false;
    });
    return array;
  }

  updateAndroid(android) {
    const {_id} = android;
    return new Promise(async (resolve, reject) => {
      this.androids = this.updateByKey(this.androids, {key: '_id', value: _id}, android);
      await this.httpClient.put(`http://localhost:3000/api/android`, android).subscribe((response) => {
        resolve(this.androids);
      });
    });
  }

  assignAndroid(android, job) {
    return new Promise(async (resolve, reject) => {
      android.assignedJob = job._id;
      this.androids = this.updateByKey(this.androids, {key: '_id', value: android._id}, android);
      await this.httpClient.put(`http://localhost:3000/api/android/${android._id}/job/${job._id}`, android).subscribe((response) => {
        resolve(this.androids);
      });
    })
  }

  getAndroidById(job) {
    let androids = [];

    this.androids.forEach(android => {
        if (android.assignedJob === job._id) {
          androids.push(android);
        }
      }
    );

    return androids;
  }
}
