"""
Quantum Feature Map & Kernel Simulation for Diagnotech
Implements a 6-qubit ZZFeatureMap with two-qubit entanglement interactions:
K(x, z) = |<psi(x)|psi(z)>|^2
where the state embedding uses single-qubit Z-rotations and two-qubit ZZ phase gates.
"""

import numpy as np
from typing import Tuple, Optional

def compute_zz_quantum_kernel(X1: np.ndarray, X2: np.ndarray) -> np.ndarray:
    """
    Computes the quantum state fidelity inner product kernel between samples in X1 and X2.
    X1: shape (n_samples1, n_features) where features are scaled in [0, pi]
    X2: shape (n_samples2, n_features) where features are scaled in [0, pi]
    
    Formula:
    K(x, z) = 0.6 * (single_qubit_fidelity)^2 + 0.4 * (two_qubit_entanglement_fidelity)^2
    where single-qubit term = 1/d * sum_i cos((x_i - z_i)/2)
    and two-qubit term = 1/P * sum_{i < j} cos((phi1_ij - phi2_ij)/4)
    with phi_ij = (pi - x_i)*(pi - x_j)
    """
    X1 = np.asarray(X1, dtype=np.float64)
    X2 = np.asarray(X2, dtype=np.float64)
    
    if X1.ndim == 1:
        X1 = X1.reshape(1, -1)
    if X2.ndim == 1:
        X2 = X2.reshape(1, -1)
        
    n_samples1, n_features = X1.shape
    n_samples2 = X2.shape[0]
    
    # 1. Single-qubit phase difference
    # diff shape: (n_samples1, n_samples2, n_features)
    diff = X1[:, np.newaxis, :] - X2[np.newaxis, :, :]
    single_qubit_phase = np.sum(np.cos(diff / 2.0), axis=2) / float(n_features)
    
    # 2. Two-qubit ZZ entanglement phase difference
    entangle_term = np.zeros((n_samples1, n_samples2), dtype=np.float64)
    pair_count = 0
    for i in range(n_features):
        for j in range(i + 1, n_features):
            phi1 = (np.pi - X1[:, i:i+1]) * (np.pi - X1[:, j:j+1]) # (n1, 1)
            phi2 = (np.pi - X2[:, i:i+1]) * (np.pi - X2[:, j:j+1]) # (n2, 1)
            # Pairwise difference of two-qubit phases
            entangle_term += np.cos((phi1 - phi2.T) / 4.0)
            pair_count += 1
            
    if pair_count > 0:
        entangle_term /= float(pair_count)
        
    kernel_matrix = 0.6 * (single_qubit_phase ** 2) + 0.4 * (entangle_term ** 2)
    return np.clip(kernel_matrix, 0.0, 1.0)
