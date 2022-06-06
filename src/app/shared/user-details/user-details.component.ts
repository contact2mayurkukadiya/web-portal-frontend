import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() row_data: any;
  constructor() { }

  ngOnInit(): void {
    this.accountDetails(this.row_data);
  }

  accountDetails(row) {
    if (row?.created_by_id == null) {
      let userData = [
        { field: "First Name", value: row.firstname },
        { field: "Last Name", value: row.lastname },
        { field: "Email Address", value: row.enduser_email },
        { field: "Company", value: row.companyname },
        { field: "Phone", value: row.phone },
        { field: "Address", value: row.address },
        { field: "Zip Code", value: row.postcode },
        { field: "Country", value: row.country },
        { field: "Created At", value: row.created_at },
        { field: "Package", value: row.packageid },
        { field: "Account Type", value: row.accounttype },
        { field: "Credits", value: row.credits },
        { field: "Purchased", value: row.purchased },
        { field: "Status", value: row.emailverified },
        { field: "Trial Limit", value: row.triallimit },
        { field: "Registration Type", value: row.registrationtype },
        { field: "Total Devices", value: row.totaldevices },
        { field: "Expiry Date", value: row.expirydate },
      ];
      this.row_data['userData'] = userData;
    } else {
      let created_by_id = row.created_by_id.username
      let endUserData = [
        { field: "First Name", value: row.firstname },
        { field: "Last Name", value: row.lastname },
        { field: "Company", value: row.companyname },
        { field: "Street", value: row.enduser_street },
        { field: "State", value: row.enduser_state },
        { field: "Zip Code", value: row.postcode },
        { field: "Email Address", value: row.enduser_email },
        { field: "User Classification", value: row.enduser_classification },
        { field: "Country", value: row.country },
        { field: "Package", value: row.packageid },
      ];
      let resellerData = [
        { field: "First Name", value: row.reseller_firstname },
        { field: "Last Name", value: row.reseller_lastname },
        { field: "Company", value: row.reseller_company },
        { field: "Street", value: row.reseller_street },
        { field: "State", value: row.reseller_state },
        { field: "Zip Code", value: row.postcode },
        { field: "Email Address", value: row.reseller_email },
      ]
      this.row_data = {
        created_by_id: created_by_id,
        end_user: endUserData,
        reseller: resellerData
      }
    }
  }
}
