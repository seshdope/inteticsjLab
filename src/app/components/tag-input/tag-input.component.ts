import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {AndroidService} from "../../services/android.service";

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {
  tagName;
  @ViewChild('tagInput') input;
  @Output() skills = [];

  constructor(private androidService: AndroidService) {
  }

  ngOnInit() {
    this.skills = this.androidService.getSkills();
  }

  addTag(e) {
    const keyCode = e.keyCode || e.which;
    const skill = this.input.nativeElement.value;

    if (keyCode == '13' && skill !== '') {
      this.skills.push(skill);
      this.input.nativeElement.value = '';
    }
  }

  deleteSkill(skill) {
    const index = this.skills.indexOf(skill);
    this.skills.splice(index, 0);
    this.androidService.deleteSkill(skill);
  }
}

