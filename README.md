Explainable Machine Learning Framework for Early Heart Disease Prediction

Project Status: Planning & Methodology Design

Project Overview

This project, developed by Group-8, Section-7, proposes an
Explainable Machine Learning (XAI) framework for early heart disease
prediction. The framework combines machine learning models with SHAP and
LIME to provide accurate predictions together with transparent and
interpretable explanations.

Team Members

S.No.   Student ID   Name

1       2420030503   K. Anoop
2       2420030490   V. Sree
3       2420030582   Sameera M.
4       2420030537   Souraja M.

Supervisor: Dr. Swanthana

Abstract

Heart disease is one of the leading causes of mortality worldwide,
making early prediction and diagnosis essential for improving patient
outcomes and reducing healthcare costs. Traditional machine learning
models can accurately predict the presence of heart disease but often
function as black-box systems, making it difficult for healthcare
professionals to understand the reasoning behind their predictions. This
project proposes an Explainable Machine Learning Framework for Early
Heart Disease Prediction that combines machine learning algorithms with
Explainable Artificial Intelligence (XAI) techniques to provide accurate
predictions along with transparent and interpretable explanations.

The proposed framework utilizes publicly available healthcare datasets
such as the UCI Heart Disease Dataset, Cleveland Heart Disease Dataset,
and Kaggle Heart Disease Dataset. The system performs data
preprocessing, including missing value handling, feature selection,
normalization, and class balancing before training models such as Random
Forest, XGBoost, Support Vector Machine (SVM), Logistic Regression, and
Decision Tree. The best-performing model is selected using evaluation
metrics. SHAP, LIME, and feature importance analysis are incorporated to
identify medical attributes that contribute significantly to
predictions, including age, cholesterol level, blood pressure, chest
pain type, maximum heart rate, and fasting blood sugar.

The framework aims to provide interpretable visual explanations that
support clinical decision-making and improve understanding of patient
risk factors. Model performance is evaluated using accuracy, precision,
recall, F1-score, ROC-AUC score, and confusion matrix. The overall goal
is to deliver accurate and trustworthy heart disease predictions with
transparent explanations that can support preventive healthcare and
timely diagnosis.

Project Objectives

Develop an accurate machine learning model for early heart disease
prediction.

Identify and select the most relevant clinical features influencing
heart disease risk.

Evaluate and compare different machine learning models based on
prediction performance.

Integrate Explainable AI techniques such as SHAP and LIME for
interpreting predictions.

Provide transparent and understandable insights that support early
diagnosis and clinical decision-making.

Datasets

The project documentation identifies the following datasets:

UCI Heart Disease Dataset

https://archive.ics.uci.edu/ml/datasets/heart+disease

Cleveland Heart Disease Dataset

https://www.kaggle.com/datasets/cherngs/heart-disease-cleveland-uci

Heart Disease Dataset

https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset

Key clinical features include age, sex, chest pain, blood pressure,
cholesterol, blood sugar, ECG, maximum heart rate, exercise-induced
angina, and ST depression.

Methodology

The proposed workflow consists of five main phases:

Data Collection --- Collect the selected heart disease datasets.

Data Preprocessing --- Perform cleaning, encoding, scaling,
missing-value handling, feature selection, normalization, and class
balancing as required.

Model Development --- Train and compare machine learning models
including Random Forest, XGBoost, SVM, Logistic Regression, and
Decision Tree.

Model Evaluation --- Evaluate models using accuracy, precision,
recall, F1-score, ROC-AUC, and confusion matrix.

Explainable Prediction --- Apply SHAP and LIME to explain
predictions and identify important patient-level factors.

Technology Stack

Python --- Main programming language

Scikit-learn --- Machine learning models and evaluation

XGBoost --- Gradient-boosting model

SHAP --- SHapley Additive exPlanations

LIME --- Local Interpretable Model-agnostic Explanations

Google Colab / Jupyter Notebook --- Development and model
training

Setup and Execution

Note: The supplied project files describe the planned technology
stack and workflow but do not specify the final GitHub repository
structure or exact script/notebook filenames. The commands below
therefore provide a standard setup for implementing the documented
framework.

1. Clone the repository

git clone https://github.com/Souraja537/KLH-CSE-2026-2420030537-Heart_Disease_Prediction/tree/main

2. Create a virtual environment (recommended)

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Activate it on macOS/Linux:

source venv/bin/activate

3. Install dependencies

If requirements.txt is available:

pip install -r requirements.txt

Otherwise, install the core libraries:

pip install pandas numpy scikit-learn xgboost shap lime matplotlib seaborn jupyter

4. Add the dataset

Download the selected heart disease dataset(s) from the dataset links
above and place the required CSV/data files in the project's data
directory.

5. Run the project

If the implementation is provided as a Jupyter Notebook:

jupyter notebook

Open the project notebook and execute the cells in order:

Data Loading → Preprocessing → Model Training → Evaluation → SHAP/LIME
Explanation → Prediction

If a Python entry-point script is provided in the repository, run it
using:

python <script_name>.py

Current Phase Status

Current Phase: Project Planning & Methodology Design

The submitted project materials currently document the problem
statement, objectives, literature survey, research gap,
innovation/novelty, feasibility, datasets, and the planned five-phase
workflow. The documented workflow progresses from data collection and
preprocessing to model development, evaluation, and explainable
prediction.

Status: Framework and methodology defined; implementation and
experimental results are not documented in the supplied files yet.

Expected Outcomes

Accurate early heart disease prediction.

Transparent AI explanations.

Identification of important patient risk factors.

Improved trust and interpretability of predictions.

Better clinical decision support.

An easy-to-use prediction framework.

Project Workflow

Heart Disease Datasets
        ↓
Data Preprocessing
        ↓
Machine Learning Models
        ↓
Model Evaluation
        ↓
SHAP / LIME Explainability
        ↓
Heart Disease Risk Prediction
        ↓
Decision Support

Conclusion

The proposed framework combines machine learning prediction with
Explainable AI to address the black-box nature of conventional
prediction systems. By integrating SHAP and LIME, the project aims to
help healthcare professionals understand the reasoning behind
predictions, supporting informed clinical decisions and early diagnosis.
