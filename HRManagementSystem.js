var spreadsheetURL = 'https://docs.google.com/spreadsheets/d/1yHrhtrfHvfXzGPejMl2qlEcmYX_3FRrgsRJb1BDth0A/edit?usp=sharing';
var sheet = SpreadsheetApp.openByUrl(spreadsheetURL).getSheetByName('EmployeeData'); 

if (sheet == null) {
  throw new Error("Sheet 'EmployeeData' not found");
}

// Initialize the employee database
function employeeDatabase() {
  sheet.clear(); // Clear the sheet if it already exists
  sheet.appendRow(["Employee ID", "Name", "Position", "Department", "Email", "Phone Number"]);
}

// Add a new employee
function addEmployee(employee) {
  sheet.appendRow([employee.id, employee.name, employee.position, employee.department, employee.email, employee.phone]);
  Logger.log('Employee data appended to sheet: ' + JSON.stringify(employee));
}

// Add a new employee example
function addNewEmployee() {
  var employee = {
    id: '10058',
    name: 'James Zuckerberg',
    position: 'Developer',
    department: 'Engineering',
    email: 'james.z@gmail.com',
    phone: '018-5500321'
  };
  Logger.log('Attempting to add employee: ' + JSON.stringify(employee));
  addEmployee(employee);
  Logger.log('Employee added successfully');
}

// Get employee details by ID
function getEmployeeById(employeeId) {
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == employeeId) {
      return data[i];
    }
  }
  
  Logger.log("Employee not found");
  return null;
}

// Get employee details example
function getEmployee() {
  var employeeId = '10058'; // Use the ID of an employee you know exists in the sheet
  var employee = getEmployeeById(employeeId);
  if (employee) {
    Logger.log('Employee data: ' + JSON.stringify(employee));
  } else {
    Logger.log('Employee not found');
  }
}

// Create an employee form
function createEmployeeForm() {
  var form = FormApp.create('Employee Information');
  form.addTextItem().setTitle('Employee ID');
  form.addTextItem().setTitle('Name');
  form.addTextItem().setTitle('Position');
  form.addMultipleChoiceItem()
      .setTitle('Department')
      .setChoiceValues(['Human Resource', 'Finance', 'Marketing and Sales', 'Research and Development', 'Customer Service']);
  form.addTextItem().setTitle('Email');
  form.addTextItem().setTitle('Phone Number (+60)');
  
  // Link the form to a Google Sheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetApp.openByUrl(spreadsheetURL).getId());
}

// Handle form submissions
function onFormSubmit(e) {
  var responses = e.values;
  var employee = {
    id: responses[0],
    name: responses[1],
    position: responses[2],
    department: responses[3],
    email: responses[4],
    phone: responses[5]
  };
  addEmployee(employee);
  Logger.log('Form submission added successfully');
}

// Create an automated leave management system
function createLeaveManagementSystem() {
  var form = FormApp.create('Leave Request Form');
  form.addTextItem().setTitle('Employee ID');
  form.addDateItem().setTitle('Start Date');
  form.addDateItem().setTitle('End Date');
  form.addMultipleChoiceItem()
      .setTitle('Leave Type')
      .setChoiceValues(['Vacation', 'Sick Leave', 'Personal Leave', 'Other']);
  form.addParagraphTextItem().setTitle('Reason');

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetApp.openByUrl(spreadsheetURL).getId());
}

// Handle leave form submissions
function onLeaveFormSubmit(e) {
  var responses = e.values;
  var calendar = CalendarApp.getDefaultCalendar();
  var startDate = new Date(responses[1]);
  var endDate = new Date(responses[2]);
  
  calendar.createEvent('Leave: ' + responses[0], startDate, endDate, {
    description: 'Leave Type: ' + responses[3] + '\nReason: ' + responses[4]
  });
  
  Logger.log('Leave request added to calendar');
}

// Set up triggers for form submissions
function setupTriggers() {
  // Add trigger for employee form
  var employeeForm = FormApp.openById('YOUR_EMPLOYEE_FORM_ID');
  ScriptApp.newTrigger('onFormSubmit')
      .forForm(employeeForm)
      .onFormSubmit()
      .create();
  
  // Add trigger for leave form
  var leaveForm = FormApp.openById('YOUR_LEAVE_FORM_ID');
  ScriptApp.newTrigger('onLeaveFormSubmit')
      .forForm(leaveForm)
      .onFormSubmit()
      .create();
}
