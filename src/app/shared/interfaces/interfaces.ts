import * as moment from 'moment';

export interface Task {
  id?: string;
  updated: moment.Moment;
  title: string;
  isDone: boolean;
}

export interface CreateResponse {
  name: string;
}

export interface User {
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  returnSecureToken: boolean;
}

export interface CurrentUser {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: true;
  refreshToken: string;
  expiresIn: string;
}

export interface Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
  hasTasks: boolean;
}

export interface Week {
  days: Day[];
}
