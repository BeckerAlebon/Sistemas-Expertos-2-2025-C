# aprendizaje.py
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Creación del conjunto de datos
# Características: Horas de Estudio, Horas de Sueño
# Etiqueta: 1 = Aprueba, 0 = Reprueba
datos = {
    "HorasEstudio": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "HorasSueno":   [4, 5, 6, 5, 6, 7, 7, 8, 8, 9],
    "Aprueba":      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
}

df = pd.DataFrame(datos)

X = df[["HorasEstudio", "HorasSueno"]]  # características
y = df["Aprueba"]                       # etiquetas

# 2. División en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Entrenamiento del modelo supervisado (árbol de decisión)
modelo = DecisionTreeClassifier(random_state=42)
modelo.fit(X_train, y_train)

# 4. Evaluación del modelo
y_pred = modelo.predict(X_test)
print("Precisión del modelo:", accuracy_score(y_test, y_pred))

# 5. Predicción con un nuevo dato
# Estudiante que estudia 6 horas y duerme 7 horas
nuevo_estudiante = pd.DataFrame([[6, 7]], columns=["HorasEstudio", "HorasSueno"])
prediccion = modelo.predict(nuevo_estudiante)

print("Predicción para estudiante (6h estudio, 7h sueño):", 
      "APRUEBA ✅" if prediccion[0] == 1 else "REPRUEBA ❌")
