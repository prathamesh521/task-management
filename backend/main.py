from flask import Flask, jsonify, request
from config import app, db
from models import Tasks
from datetime import datetime

# Initialize the database
with app.app_context():
    db.create_all()
    print("Tables created successfully!")


@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Tasks.query.all()
    task_list = [
        {
            "id": task.id,
            "date_created": task.date_created.strftime('%Y-%m-%d %H:%M:%S') if task.date_created else None,
            "entity_name": task.entity_name,
            "task_type": task.task_type,
            "task_time": task.task_time.strftime('%H:%M') if task.task_time else None,
            "contact_person": task.contact_person,
            "note": task.note,
            "status": task.status
        } for task in tasks
    ]
    return jsonify(task_list), 200


@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Tasks.query.get_or_404(task_id)
    return jsonify({
        "id": task.id,
        "date_created": task.date_created.strftime('%Y-%m-%d %H:%M:%S') if task.date_created else None,
        "entity_name": task.entity_name,
        "task_type": task.task_type,
        "task_time": task.task_time.strftime('%H:%M') if task.task_time else None,
        "contact_person": task.contact_person,
        "note": task.note,
        "status": task.status
    }), 200


@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    try:
        # Convert task_time to a datetime.time object
        task_time = datetime.strptime(data.get('task_time'), '%H:%M').time()

        new_task = Tasks(
            entity_name=data.get('entity_name'),
            task_type=data.get('task_type'),
            task_time=task_time,
            contact_person=data.get('contact_person'),
            note=data.get('note'),
            status=data.get('status', 'open')
        )
        db.session.add(new_task)
        db.session.commit()

        # Return created task with generated fields
        return jsonify({
            "message": "Task created successfully.",
            "task": {
                "id": new_task.id,
                "date_created": new_task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
                "entity_name": new_task.entity_name,
                "task_type": new_task.task_type,
                "task_time": new_task.task_time.strftime('%H:%M'),
                "contact_person": new_task.contact_person,
                "note": new_task.note,
                "status": new_task.status
            }
        }), 201
    except ValueError as e:
        return jsonify({"error": f"Invalid time format: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Tasks.query.get_or_404(task_id)
    data = request.get_json()
    try:
        # Update task_time only if provided
        if 'task_time' in data:
            task.task_time = datetime.strptime(data.get('task_time'), '%H:%M').time()

        task.entity_name = data.get('entity_name', task.entity_name)
        task.task_type = data.get('task_type', task.task_type)
        task.contact_person = data.get('contact_person', task.contact_person)
        task.note = data.get('note', task.note)
        task.status = data.get('status', task.status)

        db.session.commit()

        # Return updated task
        return jsonify({
            "message": "Task updated successfully.",
            "task": {
                "id": task.id,
                "date_created": task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
                "entity_name": task.entity_name,
                "task_type": task.task_type,
                "task_time": task.task_time.strftime('%H:%M'),
                "contact_person": task.contact_person,
                "note": task.note,
                "status": task.status
            }
        }), 200
    except ValueError as e:
        return jsonify({"error": f"Invalid time format: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Tasks.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully."}), 200


if __name__ == '__main__':
    app.run(debug=True)
