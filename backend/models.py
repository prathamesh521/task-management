from config import db
from datetime import datetime

class Tasks(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Auto-increment added explicitly
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # Default value for auto-filling
    entity_name = db.Column(db.String(255), nullable=False)
    task_type = db.Column(db.String(100), nullable=False)
    task_time = db.Column(db.Time, nullable=False)
    contact_person = db.Column(db.String(255), nullable=False)
    note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(10), default='open', nullable=False)

    def __init__(self, entity_name, task_type, task_time, contact_person, note=None, status='open'):
        self.entity_name = entity_name
        self.task_type = task_type
        self.task_time = task_time
        self.contact_person = contact_person
        self.note = note
        self.status = status

    def __repr__(self):
        return f"<Task {self.id} - {self.entity_name} - {self.status}>"