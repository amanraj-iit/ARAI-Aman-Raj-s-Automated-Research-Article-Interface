import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText
import schedule
import time
from flask import Flask, render_template, request

# SMTP server configuration
SMTP_SERVER = 'your_smtp_server'
SMTP_PORT = 587  # Update with the appropriate port number
SMTP_USERNAME = 'your_username'
SMTP_PASSWORD = 'your_password'

app = Flask(__name__)

users = {}

# Function to scrape research papers from IEEE website
def scrape_ieee_papers(interest):
    papers = []

    # Construct the search URL based on the user's interest
    search_url = f"https://ieeexplore.ieee.org/search/searchresult.jsp?queryText={interest}"

    # Send a GET request to the search URL
    response = requests.get(search_url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the paper elements and extract relevant information
    paper_elements = soup.select('.List-results-items .List-results-items-inner')

    for paper_element in paper_elements:
        title = paper_element.select_one('.title-link').text.strip()
        authors = [author.text.strip() for author in paper_element.select('.authors-list .authors-profile')]
        abstract = paper_element.select_one('.description .highlight').text.strip()
        paper = f"Title: {title}\nAuthors: {', '.join(authors)}\nAbstract: {abstract}\n"
        papers.append(paper)

    return papers

# Function to scrape research papers from Springer website
def scrape_springer_papers(interest):
    papers = []

    # Construct the search URL based on the user's interest
    search_url = f"https://link.springer.com/search?query={interest}"

    # Send a GET request to the search URL
    response = requests.get(search_url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the paper elements and extract relevant information
    paper_elements = soup.select('.result-item-content')

    for paper_element in paper_elements:
        title = paper_element.select_one('.title').text.strip()
        authors = [author.text.strip() for author in paper_element.select('.authors span')]
        abstract = paper_element.select_one('.snippet').text.strip()
        paper = f"Title: {title}\nAuthors: {', '.join(authors)}\nAbstract: {abstract}\n"
        papers.append(paper)

    return papers

def send_email(to_address, subject, body):
    # Create the email message
    message = MIMEText(body)
    message['Subject'] = subject
    message['From'] = SMTP_USERNAME
    message['To'] = to_address

    try:
        # Connect to the SMTP server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)

        # Send the email
        server.send_message(message)
        print(f"Email sent to {to_address} successfully.")

    except Exception as e:
        print("An error occurred while sending the email:", str(e))

    finally:
        # Disconnect from the SMTP server
        server.quit()

def generate_recommendations():
    # Fetch recommendations for each user
    for email, interests in users.items():
        recommended_papers = []

        # Scrape research papers for each user interest
        for interest in interests:
            ieee_papers = scrape_ieee_papers(interest)
            springer_papers = scrape_springer_papers(interest)
            recommended_papers.extend(ieee_papers + springer_papers)

        # Generate email content with recommended papers
        email_body = f"Hello,\n\nHere are some recommended research papers based on your interests:\n"
        for paper in recommended_papers:
            email_body += f"{paper}\n"

        # Send the email
        send_email(email, "Weekly Recommendations", email_body)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    email = request.form['email']
    interests = request.form.getlist('interests')

    users[email] = interests
    return 'User registered successfully.'

@app.route('/configure', methods=['GET', 'POST'])
def configure():
    if request.method == 'POST':
        email = request.form['email']
        interests = request.form.getlist('interests')

        users[email] = interests
        return 'Interests updated successfully.'

    return render_template('configure.html')

def schedule_emails():
    # Schedule weekly email generation and delivery
    schedule.every().monday.at('09:00').do(generate_recommendations)

    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    # Start the email scheduler in a separate thread
    import threading
    threading.Thread(target=schedule_emails).start()

    app.run(debug=True)
