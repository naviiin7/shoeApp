import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]'
})
export class ScrollAnimateDirective implements OnInit {
  @HostBinding('class.in-view') isVisible = false;
  @Input() threshold = 0.2; // how much visible before trigger

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: this.threshold }
    );
    observer.observe(this.el.nativeElement);
  }
}
