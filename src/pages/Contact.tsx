import React, { useState } from 'react';

const Contact: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Aqui você normalmente enviaria os dados do formulário para seu backend
		console.log('Formulário enviado:', formData);
		alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');
		setFormData({ name: '', email: '', subject: '', message: '' });
	};

	return (
		<div className='max-w-4xl mx-auto px-6 py-12'>
			<div className='text-center mb-12'>
				<h1 className='text-4xl font-bold text-gray-900 mb-4 font-poppins'>Entre em Contato</h1>
				<p className='text-xl text-gray-600 font-poppins'>
					Tem alguma pergunta ou sugestão? Adoraríamos ouvir você!
				</p>
			</div>

			<div className='grid md:grid-cols-2 gap-12'>
				{/* Contact Form */}
				<div>
					<h2 className='text-2xl font-semibold text-gray-900 mb-6 font-poppins'>
						Envie-nos uma mensagem
					</h2>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 mb-2 font-poppins'
							>
								Nome
							</label>
							<input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-poppins'
							/>
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-2 font-poppins'
							>
								Email
							</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								required
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-poppins'
							/>
						</div>

						<div>
							<label
								htmlFor='subject'
								className='block text-sm font-medium text-gray-700 mb-2 font-poppins'
							>
								Assunto
							</label>
							<select
								id='subject'
								name='subject'
								value={formData.subject}
								onChange={handleChange}
								required
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-poppins'
							>
								<option value=''>Selecione um assunto</option>
								<option value='general'>Consulta Geral</option>
								<option value='bug'>Relatório de Erro</option>
								<option value='feature'>Solicitação de Funcionalidade</option>
								<option value='partnership'>Parceria</option>
							</select>
						</div>

						<div>
							<label
								htmlFor='message'
								className='block text-sm font-medium text-gray-700 mb-2 font-poppins'
							>
								Mensagem
							</label>
							<textarea
								id='message'
								name='message'
								value={formData.message}
								onChange={handleChange}
								required
								rows={6}
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-poppins resize-none'
							/>
						</div>

						<button
							type='submit'
							className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium'
						>
							Enviar Mensagem
						</button>
					</form>
				</div>

				{/* Contact Information */}
				<div>
					<h2 className='text-2xl font-semibold text-gray-900 mb-6 font-poppins'>
						Entre em contato
					</h2>

					<div className='space-y-6'>
						<div className='flex items-start'>
							<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0'>
								<span className='text-blue-600 text-xl'>📧</span>
							</div>
							<div>
								<h3 className='font-medium text-gray-900 font-poppins'>Email</h3>
								<p className='text-gray-600 font-poppins'>contact@buscante.com</p>
							</div>
						</div>

						<div className='flex items-start'>
							<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0'>
								<span className='text-green-600 text-xl'>💬</span>
							</div>
							<div>
								<h3 className='font-medium text-gray-900 font-poppins'>Chat ao Vivo</h3>
								<p className='text-gray-600 font-poppins'>Disponível 24/7 para suporte</p>
							</div>
						</div>

						<div className='flex items-start'>
							<div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0'>
								<span className='text-purple-600 text-xl'>🕒</span>
							</div>
							<div>
								<h3 className='font-medium text-gray-900 font-poppins'>Tempo de Resposta</h3>
								<p className='text-gray-600 font-poppins'>Normalmente respondemos em 24 horas</p>
							</div>
						</div>
					</div>

					<div className='mt-8 p-6 bg-gray-50 rounded-lg'>
						<h3 className='font-medium text-gray-900 mb-3 font-poppins'>Perguntas Frequentes</h3>
						<p className='text-sm text-gray-600 mb-3 font-poppins'>
							Antes de entrar em contato, você pode encontrar respostas para perguntas comuns em
							nossa seção de FAQ.
						</p>
						<button className='text-blue-600 hover:text-blue-700 text-sm font-medium font-poppins'>
							Ver FAQ →
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
