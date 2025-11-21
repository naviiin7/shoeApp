import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'user';
}

const USERS_KEY = 'sv_users';
const CURRENT_USER_KEY = 'sv_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(this.loadCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.seedDefaultAdmin();
  }

  private loadAllUsers(): AppUser[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as AppUser[];
    } catch {
      return [];
    }
  }

  private saveAllUsers(users: AppUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private loadCurrentUser(): AppUser | null {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  private saveCurrentUser(u: AppUser | null) {
    if (u) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }

  seedDefaultAdmin() {
    const users = this.loadAllUsers();
    const adminEmail = 'admin@shoeverse.local';

    if (!users.some(u => u.email === adminEmail)) {
      users.push({
        id: 'u-admin-1',
        name: 'Site Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      this.saveAllUsers(users);
    }
  }

  register(name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Observable<boolean> {
    const users = this.loadAllUsers();

    if (users.some(u => u.email === email)) return of(false);

    const newUser: AppUser = {
      id: 'u-' + Date.now(),
      name,
      email,
      password,
      role
    };

    users.push(newUser);
    this.saveAllUsers(users);

    return of(true);
  }

  login(email: string, password: string): Observable<boolean> {
    const users = this.loadAllUsers();
    const found = users.find(u => u.email === email);

    if (!found || found.password !== password) {
      return of(false);
    }

    const safeUser: AppUser = { ...found };
    delete safeUser.password;

    this.saveCurrentUser(safeUser);
    this.currentUserSubject.next(safeUser);

    return of(true);
  }

  logout(): void {
    this.saveCurrentUser(null);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
