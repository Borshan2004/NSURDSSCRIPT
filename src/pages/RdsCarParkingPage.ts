import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CarParkingFormData {
  vehicleType: string;
  vehicleRegNo: string;
  vehicleModel: string;
  vehicleManufacturer: string;
  driverType: string;
  driverAddress: string;
  drivingLicenseNo: string;
  drivingLicenseExpiry: string;
  driverNID: string;
  vehicleEngineNo: string;
  driverContactNo: string;
  vehiclePlateNo: string;
  semesterLabel: string;
}

export class RdsCarParkingPage extends BasePage {
  readonly pageHeading: Locator;
  readonly addNewButton: Locator;
  readonly vehicleTypeSelect: Locator;
  readonly vehicleRegNoInput: Locator;
  readonly vehicleModelInput: Locator;
  readonly vehicleManufacturerInput: Locator;
  readonly driverTypeSelect: Locator;
  readonly driverAddressInput: Locator;
  readonly drivingLicenseNoInput: Locator;
  readonly drivingLicenseExpiryInput: Locator;
  readonly driverNIDInput: Locator;
  readonly durationSelect: Locator;
  readonly vehicleEngineNoInput: Locator;
  readonly driverContactNoInput: Locator;
  readonly vehiclePlateNoInput: Locator;
  readonly semesterCodeSelect: Locator;
  readonly agreementCheckbox: Locator;
  readonly submitButton: Locator;
  readonly requestsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByRole('heading', { name: 'NSU Car Parking Service' }).first();
    this.addNewButton = this.page.getByRole('button', { name: 'Add New' });
    this.vehicleTypeSelect = this.page.locator('#vehicleType');
    this.vehicleRegNoInput = this.page.locator('#vehicleRegNo');
    this.vehicleModelInput = this.page.locator('#vehicleModel');
    this.vehicleManufacturerInput = this.page.locator('#vehicleManufacturer');
    this.driverTypeSelect = this.page.locator('#driverType');
    this.driverAddressInput = this.page.locator('#driverAddress');
    this.drivingLicenseNoInput = this.page.locator('#drivingLicenseNo');
    this.drivingLicenseExpiryInput = this.page.locator('#drivingLicenseExpiry');
    this.driverNIDInput = this.page.locator('#driverNID');
    this.durationSelect = this.page.locator('#duration');
    this.vehicleEngineNoInput = this.page.locator('#vehicleEngineNo');
    this.driverContactNoInput = this.page.locator('#driverContactNo');
    this.vehiclePlateNoInput = this.page.locator('#vehiclePlateNo');
    this.semesterCodeSelect = this.page.locator('#semesterCode');
    this.agreementCheckbox = this.page.getByRole('checkbox');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.requestsTable = this.page.getByRole('table').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('common/service/carParkingRequestDashboard');
    await this.waitForReady();
  }

  async openAddNewForm(): Promise<void> {
    await this.addNewButton.click();
    await this.vehicleTypeSelect.waitFor({ state: 'visible' });
  }

  async fillParkingForm(data: CarParkingFormData): Promise<void> {
    await this.vehicleTypeSelect.selectOption({ label: data.vehicleType });
    await this.vehicleRegNoInput.fill(data.vehicleRegNo);
    await this.vehicleModelInput.fill(data.vehicleModel);
    await this.vehicleManufacturerInput.fill(data.vehicleManufacturer);
    await this.driverTypeSelect.selectOption({ label: data.driverType });
    await this.driverAddressInput.fill(data.driverAddress);
    await this.drivingLicenseNoInput.fill(data.drivingLicenseNo);
    await this.drivingLicenseExpiryInput.fill(data.drivingLicenseExpiry);
    await this.driverNIDInput.fill(data.driverNID);
    await this.vehicleEngineNoInput.fill(data.vehicleEngineNo);
    await this.driverContactNoInput.fill(data.driverContactNo);
    await this.vehiclePlateNoInput.fill(data.vehiclePlateNo);
    await this.semesterCodeSelect.selectOption({ label: data.semesterLabel });
    await this.agreementCheckbox.check();
  }

  async submitForm(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation().catch(() => {}),
      this.submitButton.click(),
    ]);
    await this.waitForReady();
  }

  getRequestRowByVehicleReg(regNo: string): Locator {
    return this.requestsTable.getByRole('row').filter({ hasText: regNo }).first();
  }
}
