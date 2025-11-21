import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { CartService } from '../../../core/services/cart.service';
import { CartUiService } from '../../../core/services/cart-ui.service';
import { AuthService, AppUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  hidden = false;
  scrolled = false;
  cartCount = 0;

  currentUser: AppUser | null = null;

  private scrollSub: Subscription | null = null;
  private cartSub: Subscription | null = null;
  private authSub: Subscription | null = null;
  private lastScroll = 0;

  private readonly SMALL_DELTA = 8;
  private readonly HIDE_AFTER = 80;

  constructor(
    private router: Router,
    private cart: CartService,
    private ui: CartUiService,
    private zone: NgZone,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // cart count subscription
    this.cartSub = this.cart.cart$.subscribe(items => {
      this.cartCount = Array.isArray(items) ? items.reduce((s, i) => s + (i.qty || 0), 0) : 0;
    });

    // auth subscription
    this.authSub = this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.lastScroll = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;

    this.zone.runOutsideAngular(() => {
      this.scrollSub = fromEvent(window, 'scroll')
        .pipe(throttleTime(50))
        .subscribe(() => this.onWindowScroll());
    });
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  private onWindowScroll() {
    this.zone.run(() => {
      const current = window.scrollY || window.pageYOffset || 0;
      this.scrolled = current > 8;

      if (this.isMenuOpen) {
        this.hidden = false;
        this.lastScroll = current;
        return;
      }

      const delta = current - this.lastScroll;
      if (Math.abs(delta) <= this.SMALL_DELTA) {
        this.lastScroll = current;
        return;
      }

      if (current < this.HIDE_AFTER) {
        this.hidden = false;
        this.lastScroll = current;
        return;
      }

      this.hidden = delta > 0;
      this.lastScroll = current;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.hidden = false;
  }

  navigateTo(path: string) {
    this.isMenuOpen = false;
    this.router.navigateByUrl(path);
  }

  openMiniCart() {
    this.ui.toggle();
  }

  navigateToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (!el) {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => this.scrollToElementById(sectionId), 150);
      });
      return;
    }
    this.scrollToElementById(sectionId);
  }

  navigateToFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const y = footer.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  private scrollToElementById(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 96;
    const rectTop = el.getBoundingClientRect().top + window.scrollY;
    const dest = Math.max(0, Math.floor(rectTop - headerHeight - 12));
    window.scrollTo({ top: dest, behavior: 'smooth' });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
