FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
ENV DB_PATH=/data/bandtrack.db
ENV FLASK_DEBUG=0
VOLUME ["/data"]
EXPOSE 5000
CMD ["sh", "-c", "python -c 'import app; app.init_db()' && gunicorn -b 0.0.0.0:5000 -w 2 app:app"]
