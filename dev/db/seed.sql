USE hr_tracker;

INSERT INTO department(name) 
VALUES ("administrative"),
        ("marketing"),
        ("sales"),
        ("development"),
        ("design");

INSERT INTO role (title, salary, department_id)
VALUES ("administration manager", 100000, 1),
        ("accountant", 80000, 1),
        ("human resource specialist", 70000, 1),
        ("marketing manager", 130000, 2),
        ("ecommerce marketer", 70000, 2),
        ("sales manager", 130000, 3),
        ("local sales person", 70000, 3),
        ("technical manager", 160000, 4),
        ("backend developer", 80000, 4),
        ("frontend developer", 80000, 4),
        ("graphic designer", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Irene", "Kim", 1, null),
        ("Rachel", "White", 2, 1),
        ("Terry", "Forbes", 4, null),
        ("Brian", "Fernandez", 5, 3),
        ("Tom", "Bradly", 6, null),
        ("Kate", "Lee", 7, 5),
        ("Andy", "Cho", 8, null),
        ("Emily", "Yu", 9, 7),
        ("Asada","Mao",11,null),
        ("Amanda","Tank",10,7);

 

