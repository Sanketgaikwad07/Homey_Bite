package com.mywork.homey_bites.config;

import com.mywork.homey_bites.filters.JwtAuthenticationFilter;
import com.mywork.homey_bites.servies.AppUserDetailsService;
import com.mywork.homey_bites.servies.UserServices;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService UserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;




    @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
             http
                         .cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
                         .authorizeHttpRequests(auth->auth
                             .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                             .requestMatchers("/api/register","/api/login","/api/foods/**","/api/orders/all","/api/orders/status/**").permitAll()

                           //  .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                             .anyRequest().authenticated()).sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                     .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

             return http.build();


        }

        @Bean

        public PasswordEncoder passwordEncoder() {
         return new BCryptPasswordEncoder();
        }
        @Bean
        public CorsFilter corsFilter(){
        return   new CorsFilter(corsConfigurationSource());
        }

        private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config=new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173","http://localhost:5174"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
     //   config.setAllowedHeaders(List.of("Authorization","content-type"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",config);
        return source;
        }
    @Bean
    public AuthenticationManager authenticationManager() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider( UserDetailsService);

        authProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authProvider);
    }

    }

