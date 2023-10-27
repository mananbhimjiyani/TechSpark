import joblib
import pandas as pd
import real_time_sentiment as rts
import yfinance as yf
import nltk
import streamlit as st

# Avoid warnings and download NLTK data
nltk.download('vader_lexicon')

# Define the company mapping
company_mapping = {
    0: 'ADANIPORTS.NS', 1: 'APOLLOHOSP.NS', 2: 'ASIANPAINT.NS', 3: 'AXISBANK.NS',
    4: 'BAJAJ-AUTO.NS', 5: 'BAJAJFINSV.NS', 6: 'BPCL.NS', 7: 'BRITANNIA.NS', 8: 'CIPLA.NS', 9: 'COALINDIA.NS',
    10: 'DIVISLAB.NS', 11: 'DRREDDY.NS', 12: 'EICHERMOT.NS', 13: 'GRASIM.NS', 14: 'HCLTECH.NS', 15: 'HDFCLIFE.NS',
    16: 'HDFCBANK.NS', 17: 'HEROMOTOCO.NS', 18: 'HINDALCO.NS', 19: 'HINDUNILVR.NS', 20: 'ICICIBANK.NS',
    21: 'INDUSINDBK.NS', 22: 'INFY.NS', 23: 'ITC.NS', 24: 'JIOFIN.NS', 25: 'JSWSTEEL.NS', 26: 'KOTAKBANK.NS',
    27: 'LT.NS', 28: 'LTIM.NS', 29: 'M&M.NS', 30: 'MARUTI.NS', 31: 'NESTLEIND.NS', 32: 'NIFTY50.NS', 33: 'NTPC.NS',
    34: 'ONGC.NS', 35: 'POWERGRD.NS', 36: 'RELIANCE.NS', 37: 'SBILIFE.NS', 38: 'SBIN.NS', 39: 'SUNPHARMA.NS',
    40: 'TCS.NS', 41: 'TATACONSUM.NS', 42: 'TATAMOTORS.NS', 43: 'TATASTEEL.NS', 44: 'TECHM.NS', 45: 'TITAN.NS',
    46: 'ULTRACEMCO.NS', 47: 'UPL.NS', 48: 'WIPRO.NS'
}

# Define the Forex mapping
forex_mapping = {
    0: 'AUD-USD-ASK.joblib', 1: 'AUD-USD-BID.joblib', 2: 'EUR-USD-ASK.joblib', 3: 'EUR-USD-BID.joblib',
    4: 'GBP-USD-ASK.joblib', 5: 'GBP-USD-BID.joblib', 6: 'NZD-USD-ASK.joblib', 7: 'NZD-USD-BID.joblib',
    8: 'USD-CAD-ASK.joblib', 9: 'USD-CAD-BID.joblib', 10: 'USD-CHF-ASK.joblib', 11: 'USD-CHF-BID.joblib',
    12: 'USD-JPY-ASK.joblib', 13: 'USD-JPY-BID.joblib', 14: 'XAG-USD-ASK.joblib', 15: 'XAG-USD-BID.joblib'
}

# Load the stock model and Forex models from GoDaddy server
def load_models():
    stock_model = joblib.load('https://example.com/path-to-stock-model.joblib')  # Replace with your URL
    forex_models = {}
    for forex_symbol, model_filename in forex_mapping.items():
        model = joblib.load(f'https://example.com/path-to-forex-models/{model_filename}')  # Replace with your URL
        forex_models[forex_symbol] = model
    return stock_model, forex_models

st.title("Stock and Forex Price Predictor")

# Load the models
stock_model, forex_models = load_models()

# Create a select box to choose between Stock and Forex predictions
prediction_type = st.selectbox("Select prediction type:", ["Stock", "Forex"])

if prediction_type == "Stock":
    # Select the company for stock prediction
    company_symbol = st.selectbox("Select a company:", list(company_mapping.keys()))
    company = company_mapping[company_symbol]

    # Prepare the input data for stock prediction
    data = pd.DataFrame({
        'Close_Lagged': [rts.get_current_closing(company)],
        'Sentiment_Score': [rts.get_current_sentiment(company)],
        'Company': [company_symbol],
    })

    # Create the test DataFrame
    test_data = pd.DataFrame(data)

    # Extract features from test data
    X_test = test_data[['Close_Lagged', 'Sentiment_Score', 'Company']]

    # Make predictions using the loaded stock model
    y_pred = stock_model.predict(X_test)

    # Display the stock prediction
    st.write("Stock Price Prediction:")
    st.write(f"Company: {company_mapping[company_symbol]}")
    st.write(f"Predicted Price: {float(y_pred[0]):.2f}")

else:
    # Select the Forex index
    forex_symbol = st.selectbox("Select a Forex index:", list(forex_mapping.keys()))

    # Retrieve the corresponding Forex model
    model = forex_models[forex_symbol]

    forex = yf.Ticker(forex_mapping[forex_symbol][:3] + '=X')
    data = forex.history(period="1d", interval="1m")

    # Extract necessary data for prediction
    forex_close = data['Close'].iloc[-1]
    forex_high = data['High'].iloc[-1]
    forex_low = data['Low'].iloc[-1]
    forex_volume = data['Volume'].iloc[-1]

    # Make the Forex prediction
    forex_prediction = model.predict(pd.DataFrame([{
        'Close': forex_close,
        'High': forex_high,
        'Low': forex_low,
        'Volume': forex_volume
    }]))

    # Display the Forex prediction
    st.write("Forex Price Prediction:")
    st.write(f"Forex Index: {forex_mapping[forex_symbol]}")
    st.write(f"Predicted Price: {float(forex_prediction[0]):.2f}")


