import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Shoe',
    brand: 'TestBrand',
    category: 'Running',
    price: 99.99,
    sizes: [8,9,10],
    inStock: true,
    image: 'assets/images/placeholder.png',
    description: 'Test description'
  };

  const productServiceStub = {
    getProductById: (id: any) => of(mockProduct),
    getProductsByCategory: (cat: string) => of([mockProduct])
  };

  const cartServiceStub = {
    add: jasmine.createSpy('add')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        { provide: CartService, useValue: cartServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product (observable) and set local product', (done) => {
    component.product$.subscribe(p => {
      expect(p).toBeTruthy();
      expect(component.product).toBeTruthy();
      expect(component.product?.id).toBe(1);
      done();
    });
  });

  it('should have similarProducts$ that resolves to array', (done) => {
    component.similarProducts$.subscribe(list => {
      expect(Array.isArray(list)).toBeTrue();
      done();
    });
  });

  it('addToCart should call cart.add', () => {
    component.product = mockProduct;
    component.addToCart();
    expect(cartServiceStub.add).toHaveBeenCalledWith(mockProduct, component.qty);
  });
});
